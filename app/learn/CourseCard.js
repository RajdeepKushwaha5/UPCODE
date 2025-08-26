'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaStar, FaUsers, FaClock, FaArrowRight, FaMedal, FaCode, FaGraduationCap, FaRobot } from 'react-icons/fa';
import AITutorBoat from '../../components/shared/AITutorBoat';

const CourseCard = ({
    name,
    title,
    desc,
    image,
    progress,
    difficulty,
    duration,
    students,
    rating,
    category,
    featured,
    index,
    isNew
}) => {
    const router = useRouter();
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    const getDifficultyColor = (level) => {
        switch (level) {
            case 'Beginner': return 'from-green-400 to-emerald-500';
            case 'Intermediate': return 'from-yellow-400 to-orange-500';
            case 'Advanced': return 'from-red-400 to-pink-500';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'from-green-400 to-emerald-500';
        if (progress >= 50) return 'from-yellow-400 to-orange-500';
        return 'from-purple-400 to-pink-500';
    };

    return (
        <div
            className={`group relative animate-fade-in-up animation-delay-${index * 200} cursor-pointer`}
            onClick={() => router.push(`/courses/${name}`)}
        >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            {/* Featured Badge */}
            {featured && (
                <div className="absolute -top-3 -right-3 z-20">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 animate-pulse">
                        <FaMedal className="text-xs" />
                        FEATURED
                    </div>
                </div>
            )}

            {/* New Badge */}
            {isNew && (
                <div className="absolute -top-3 -left-3 z-20">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                        NEW
                    </div>
                </div>
            )}

            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">

                {/* Category Badge */}
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm border border-purple-400/30">
                        {category}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <FaStar className="text-sm" />
                        <span className="text-sm font-bold">{rating}</span>
                    </div>
                </div>

                {/* Course Image */}
                <div className="relative mb-6 flex justify-center">
                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <img
                            src={image}
                            alt={title}
                            className="relative w-20 h-20 object-contain rounded-2xl shadow-lg"
                        />
                    </div>
                </div>

                {/* Course Title */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors font-space leading-tight">
                    {title}
                </h3>

                {/* Course Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-inter group-hover:text-gray-300 transition-colors">
                    {desc}
                </p>

                {/* Progress Bar */}
                {progress && (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400 font-inter">Progress</span>
                            <span className="text-sm font-bold text-white">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full transition-all duration-1000 group-hover:animate-pulse`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Course Meta Info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                            <FaClock className="text-blue-400 text-sm" />
                        </div>
                        <div className="text-xs text-gray-400 font-inter">{duration}</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                            <FaUsers className="text-green-400 text-sm" />
                        </div>
                        <div className="text-xs text-gray-400 font-inter">{students}</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                            <FaGraduationCap className="text-purple-400 text-sm" />
                        </div>
                        <div className={`text-xs bg-gradient-to-r ${getDifficultyColor(difficulty)} bg-clip-text text-transparent font-bold`}>
                            {difficulty}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold py-3 px-6 rounded-2xl hover:scale-105 transform transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-blue-500 flex items-center justify-center gap-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsChatbotOpen(true);
                    }}
                >
                    <FaRobot className="text-sm" />
                    <span className="font-space tracking-wide">Start Learning with AI Tutor</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform text-sm" />
                </button>
            </div>

            {/* AI Tutor Boat */}
            <AITutorBoat
                language={name}
                isOpen={isChatbotOpen}
                onClose={() => setIsChatbotOpen(false)}
                onProgressUpdate={(progress) => {
                    // Update progress in real-time
                }}
            />
        </div>
    );
};

export default CourseCard;