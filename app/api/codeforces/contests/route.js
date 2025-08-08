import { NextResponse } from 'next/server'
import { Contest } from '@/models/Contest'
import dbConnect from '@/utils/dbConnect'

export async function GET() {
  try {
    await dbConnect();

    // Fetch from Codeforces API
    const response = await fetch('https://codeforces.com/api/contest.list')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status === 'OK') {
      // Sort contests by start time and get recent ones
      const sortedContests = data.result
        .sort((a, b) => b.startTimeSeconds - a.startTimeSeconds)
        .slice(0, 30)

      // Convert and save to our database format
      const convertedContests = await Promise.all(
        sortedContests.map(async (cfContest) => {
          const existingContest = await Contest.findOne({
            id: `cf_${cfContest.id}`
          });

          if (!existingContest) {
            // Convert Codeforces contest to our format
            const startDate = new Date(cfContest.startTimeSeconds * 1000);
            const endDate = new Date((cfContest.startTimeSeconds + cfContest.durationSeconds) * 1000);
            const now = new Date();

            // Determine phase and status
            let phase = 'BEFORE';
            let status = 'upcoming';

            if (cfContest.phase === 'CODING') {
              phase = 'CODING';
              status = 'live';
            } else if (cfContest.phase === 'FINISHED') {
              phase = 'FINISHED';
              status = 'completed';
            }

            const contestData = {
              id: `cf_${cfContest.id}`,
              title: cfContest.name,
              description: `Codeforces Contest #${cfContest.id} - ${cfContest.type}`,
              link: `https://codeforces.com/contest/${cfContest.id}`,
              start: startDate,
              end: endDate,
              startTimeSeconds: cfContest.startTimeSeconds,
              durationSeconds: cfContest.durationSeconds,
              phase: cfContest.phase || phase,
              source: 'codeforces',
              type: cfContest.type === 'CF' ? 'weekly' : 'educational',
              status,
              duration: Math.floor(cfContest.durationSeconds / 60),
              difficulty: 'Medium',
              rating: '1200-2400',
              prize: '$0',
              host: 'Codeforces',
              registeredUsers: [],
              participants: 0,
              ranklist: []
            };

            try {
              const newContest = await Contest.create(contestData);
              return {
                ...cfContest,
                _id: newContest._id,
                dbId: newContest._id,
                isInDatabase: true
              };
            } catch (error) {
              console.error('Error saving contest:', error);
              return {
                ...cfContest,
                isInDatabase: false
              };
            }
          } else {
            // Update existing contest with latest data
            await Contest.findByIdAndUpdate(existingContest._id, {
              phase: cfContest.phase,
              startTimeSeconds: cfContest.startTimeSeconds,
              durationSeconds: cfContest.durationSeconds
            });

            return {
              ...cfContest,
              _id: existingContest._id,
              dbId: existingContest._id,
              isInDatabase: true
            };
          }
        })
      );

      return NextResponse.json({
        status: 'OK',
        result: convertedContests,
        source: 'codeforces',
        cached: false,
        timestamp: Date.now()
      })
    } else {
      throw new Error('Codeforces API returned error status')
    }
  } catch (error) {
    console.error('Error fetching contests:', error)

    // Fallback to database contests if external API fails
    try {
      await dbConnect();
      const dbContests = await Contest.find({ source: 'codeforces' })
        .sort({ startTimeSeconds: -1 })
        .limit(30);

      const formattedContests = dbContests.map(contest => ({
        id: contest.id.replace('cf_', ''),
        name: contest.title,
        type: contest.type === 'weekly' ? 'CF' : 'ICPC',
        phase: contest.phase,
        startTimeSeconds: contest.startTimeSeconds,
        durationSeconds: contest.durationSeconds,
        _id: contest._id,
        dbId: contest._id,
        isInDatabase: true
      }));

      return NextResponse.json({
        status: 'OK',
        result: formattedContests,
        source: 'database_fallback',
        cached: true,
        timestamp: Date.now()
      });
    } catch (dbError) {
      console.error('Database fallback error:', dbError);
      return NextResponse.json(
        { error: 'Failed to fetch contests' },
        { status: 500 }
      )
    }
  }
}
