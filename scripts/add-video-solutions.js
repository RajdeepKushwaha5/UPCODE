import dbConnect from '../utils/dbConnect.js'
import Problem from '../models/Problem.js'

// Sample YouTube video IDs for different problems
const videoSolutions = {
  'two-sum': 'KLlXCFG5TnA', // Real Two Sum explanation video
  'add-two-numbers': 'wgFPrzTjm7s',
  'longest-substring-without-repeating-characters': 'wiGpQwVHdE0',
  'median-of-two-sorted-arrays': 'q6IEA26hvXc',
  'longest-palindromic-substring': 'y2BD4MJqV20',
  'zigzag-conversion': 'Q2Tw6gcVEwg',
  'reverse-integer': 'HAgytlkWjQQ',
  'string-to-integer-atoi': 'C1_lGNHOu9g',
  'palindrome-number': 'kVEtg3VoFEo',
  'regular-expression-matching': 'l3hda49XcDE'
}

async function updateProblemsWithVideos() {
  try {
    await dbConnect()

    console.log('🎥 Adding YouTube video solutions to problems...')

    for (const [slug, videoId] of Object.entries(videoSolutions)) {
      const result = await Problem.findOneAndUpdate(
        { slug: slug },
        { 
          $set: { 
            videoSolution: videoId,
            // Also ensure we have proper examples and constraints format
            updatedAt: new Date()
          }
        },
        { new: true }
      )

      if (result) {
        console.log(`✅ Updated ${slug} with video: https://youtube.com/watch?v=${videoId}`)
      } else {
        console.log(`❌ Problem not found: ${slug}`)
      }
    }

    // Also update Two Sum with enhanced data
    await Problem.findOneAndUpdate(
      { slug: 'two-sum' },
      {
        $set: {
          videoSolution: 'KLlXCFG5TnA',
          examples: [
            {
              input: 'nums = [2,7,11,15], target = 9',
              output: '[0,1]',
              explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
            },
            {
              input: 'nums = [3,2,4], target = 6',
              output: '[1,2]',
              explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
            },
            {
              input: 'nums = [3,3], target = 6',
              output: '[0,1]',
              explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].'
            }
          ],
          constraints: [
            '2 <= nums.length <= 10^4',
            '-10^9 <= nums[i] <= 10^9',
            '-10^9 <= target <= 10^9',
            'Only one valid answer exists.'
          ],
          hints: [
            'A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it\'s best to try out brute force solutions for simpler problems.',
            'So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array somehow so that this search becomes faster?',
            'The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?'
          ],
          companies: ['Amazon', 'Google', 'Apple', 'Microsoft', 'Facebook'],
          tags: ['Array', 'Hash Table'],
          acceptanceRate: 47.3
        }
      }
    )

    console.log('🎉 Successfully updated problems with video solutions!')

  } catch (error) {
    console.error('❌ Error updating problems:', error)
  } finally {
    process.exit(0)
  }
}

updateProblemsWithVideos()
