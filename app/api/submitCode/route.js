import Problem from '../../../models/Problem';
import dbConnect from '../../../utils/dbConnect';
import { User } from "../../../models/User";
import { UserInfo } from "../../../models/UserInfo.js";
import { SolvedProblem } from "../../../models/SolvedProblem";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route.js"
import { submitCodeExecution, getExecutionResult } from '@/lib/judge0Service.dev';

export async function POST(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userID = session?.user?._id;
    if (userID) {

        const { code, problem, language, contest } = await req.json()
        // console.log(code,problem,language,contest)
        const user = await User.findById(userID)
        const userdata = await UserInfo.findById(user.userInfo).populate('solved')
        const prob = await Problem.findOne({ id: problem })
        const existingSolvedProblem = userdata.solved.find(
            (solvedProblem) => solvedProblem.problem.equals(prob._id)
        );

        // Map language names to Judge0 language IDs
        const languageMap = {
            'python': 71,
            'java': 62,
            'cpp': 54,
            'c': 50,
            'javascript': 63,
            'csharp': 51
        };

        const languageId = languageMap[language.toLowerCase()] || 71; // Default to Python

        // Execute code using our service
        const execution = await submitCodeExecution(code, languageId, prob.testCases[0].input[0]);

        if (!execution.success) {
            return Response.json({ error: 'Code execution failed', details: execution.error }, { status: 500 });
        }

        let result;
        if (execution.result) {
            result = execution.result;
        } else {
            // Wait for real execution
            await new Promise(resolve => setTimeout(resolve, 2000));
            const executionResult = await getExecutionResult(execution.token);
            result = executionResult.result;
        }

        let tcPass;
        let isAccepted;
        const output = result.stdout?.trim() || '';

        if (output === prob.testCases[0].output[0]) {
            tcPass = 1
            isAccepted = "accepted"
        } else {
            tcPass = 0
            isAccepted = "rejected"
        }
        const newSolution = {
            contest: contest !== null ? contest : undefined,
            code: code,
            complexity: [data.cpuTime, data.memory],
            status: isAccepted,
            passedTestCases: tcPass
        };
        if (existingSolvedProblem) {
            existingSolvedProblem.solution.push(newSolution);
            existingSolvedProblem.attempts = (existingSolvedProblem.attempts || 0) + 1;
            await existingSolvedProblem.save();
            
            // Update user stats if problem was solved
            if (isAccepted === "accepted") {
                user.problemsSolved = (user.problemsSolved || 0) + 1;
                if (prob.difficulty === 'Easy') user.easySolved += 1;
                else if (prob.difficulty === 'Medium') user.mediumSolved += 1;
                else if (prob.difficulty === 'Hard') user.hardSolved += 1;
                user.lastSolvedDate = new Date();
                await user.save();
            }
            
            return new Response(JSON.stringify({ 
                success: true, 
                status: isAccepted, 
                message: isAccepted === "accepted" ? "Congratulations! Your solution was accepted." : "Your solution failed some test cases."
            }), { status: 201 })
        }
        else {
            if ((isAccepted && contest) || !contest) {
                const newSolve = new SolvedProblem({
                    userId: user._id,
                    problemId: problem.toString(),
                    contest: contest !== null ? contest : undefined,
                    problem: prob._id,
                    solution: [newSolution],
                    language: language,
                    attempts: 1,
                    difficulty: prob.difficulty
                });
                
                const newSol = await newSolve.save();
                userdata.solved.push(newSol.id);
                await userdata.save();
                
                // Update user stats
                if (isAccepted === "accepted") {
                    user.problemsSolved = (user.problemsSolved || 0) + 1;
                    if (prob.difficulty === 'Easy') user.easySolved += 1;
                    else if (prob.difficulty === 'Medium') user.mediumSolved += 1;
                    else if (prob.difficulty === 'Hard') user.hardSolved += 1;
                    user.lastSolvedDate = new Date();
                    await user.save();
                }
                
                return new Response(JSON.stringify({ 
                    success: true, 
                    status: isAccepted, 
                    message: isAccepted === "accepted" ? "Congratulations! Your solution was accepted." : "Your solution failed some test cases."
                }), { status: 201 })
            }
            else {
                return new Response(JSON.stringify({ 
                    success: false, 
                    message: "Testcase Failed" 
                }), { status: 400 })
            }
        }

    }
    return new Response('User Not Found', { status: 401 })
}