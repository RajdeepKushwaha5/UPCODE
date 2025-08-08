import { model, models, Schema } from "mongoose";

const ContestSchema = Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    // Add startTimeSeconds for external API compatibility
    startTimeSeconds: {
        type: Number,
        required: false
    },
    // Add durationSeconds for external API compatibility
    durationSeconds: {
        type: Number,
        required: false
    },
    // Add phase for external API compatibility
    phase: {
        type: String,
        enum: ['BEFORE', 'CODING', 'PENDING_SYSTEM_TEST', 'SYSTEM_TEST', 'FINISHED'],
        default: 'BEFORE'
    },
    // Add source for tracking contest origin
    source: {
        type: String,
        enum: ['internal', 'codeforces', 'leetcode', 'atcoder'],
        default: 'internal'
    },
    problems: [{
        type: Schema.Types.ObjectId,
        ref: 'Problem'
    }],
    ranklist: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'UserInfo'
            },
            score: {
                type: Number,
                default: 0
            },
            finish_time: {
                type: Date,
                default: Date.now
            }
        }
    ],
    registeredUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'UserInfo'
    }],
    participants: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['weekly', 'biweekly', 'monthly', 'educational'],
        default: 'weekly'
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'completed'],
        default: 'upcoming'
    },
    duration: {
        type: Number, // in minutes
        default: 90
    },
    difficulty: {
        type: String,
        default: 'Medium'
    },
    prize: {
        type: String,
        default: '$0'
    },
    rating: {
        type: String,
        default: '1200-2000'
    },
    host: {
        type: String,
        default: 'UpCode'
    }

})

export const Contest = models?.Contest || model('Contest', ContestSchema);