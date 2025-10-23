'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaStar, FaUsers, FaClock, FaArrowRight, FaMedal, FaCode, FaGraduationCap, FaBook, FaVideo, FaExternalLinkAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { languageResources } from '../../data/languageResources';

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
    const [showResources, setShowResources] = useState(false);
    const [activeTab, setActiveTab] = useState('introduction');

    const resources = languageResources[name] || {};

    const getDifficultyColor = (level) => {
        switch (level) {
            case 'Beginner': return 'from-green-400 to-emerald-500';
            case 'Intermediate': return 'from-yellow-400 to-orange-500';
            case 'Advanced': return 'from-red-400 to-red-600';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'from-green-400 to-emerald-500';
        if (progress >= 50) return 'from-yellow-400 to-orange-500';
        return 'from-blue-400 to-blue-600';
    };

    const ResourceTab = ({ tabKey, tabName, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(tabKey)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tabKey
                    ? 'bg-blue-600 text-white'
                    : 'theme-surface theme-text-secondary hover:theme-surface-elevated'
            }`}
        >
            <Icon className="text-sm" />
            <span className="text-sm font-medium">{tabName}</span>
        </button>
    );

    const ResourceContent = () => {
        switch (activeTab) {
            case 'introduction':
                return (
                    <div className="space-y-4">
                        <div>
                            <h4 className="theme-accent font-semibold mb-2">Overview</h4>
                            <p className="theme-text-secondary text-sm leading-relaxed">
                                {resources.introduction?.overview}
                            </p>
                        </div>
                        <div>
                            <h4 className="theme-accent font-semibold mb-2">Use Cases</h4>
                            <div className="grid grid-cols-1 gap-1">
                                {resources.introduction?.useCases?.map((useCase, idx) => (
                                    <span key={idx} className="theme-text-secondary text-sm flex items-center gap-2">
                                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                        {useCase}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'getting-started':
                return (
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-green-400 font-semibold mb-2">
                                {resources.gettingStarted?.setup?.title}
                            </h4>
                            <div className="space-y-2">
                                {resources.gettingStarted?.setup?.steps?.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <span className="theme-text-secondary text-sm">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-green-400 font-semibold mb-2">
                                {resources.gettingStarted?.firstCode?.title}
                            </h4>
                            <pre className="theme-surface p-3 rounded-lg text-xs theme-text-secondary overflow-x-auto border theme-border">
                                <code>{resources.gettingStarted?.firstCode?.code}</code>
                            </pre>
                        </div>
                    </div>
                );
            case 'concepts':
                return (
                    <div className="space-y-3">
                        {resources.coreConcepts?.map((concept, idx) => (
                            <div key={idx} className="border-l-2 border-blue-400 pl-3">
                                <h5 className="text-blue-400 font-medium text-sm">{concept.topic}</h5>
                                <p className="theme-text-secondary text-xs mt-1">{concept.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'tutorials':
                return (
                    <div className="space-y-3">
                        {resources.interactiveTutorials?.map((tutorial, idx) => (
                            <div key={idx} className="theme-surface p-3 rounded-lg border theme-border">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h5 className="text-yellow-400 font-medium text-sm flex items-center gap-2">
                                            {tutorial.name}
                                            {tutorial.free && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">FREE</span>}
                                        </h5>
                                        <p className="theme-text-secondary text-xs mt-1">{tutorial.description}</p>
                                    </div>
                                    <a
                                        href={tutorial.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="theme-accent hover:theme-text-secondary ml-2"
                                    >
                                        <FaExternalLinkAlt className="text-xs" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'videos':
                return (
                    <div className="space-y-3">
                        {resources.videoResources?.map((video, idx) => (
                            <div key={idx} className="theme-surface p-3 rounded-lg border theme-border">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h5 className="text-red-400 font-medium text-sm flex items-center gap-2">
                                            <FaVideo className="text-xs" />
                                            {video.name}
                                            {video.free && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">FREE</span>}
                                        </h5>
                                        <p className="theme-text-secondary text-xs mt-1">{video.description}</p>
                                        <span className="theme-text-secondary text-xs opacity-70">{video.platform}</span>
                                    </div>
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="theme-accent hover:theme-text-secondary ml-2"
                                    >
                                        <FaExternalLinkAlt className="text-xs" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'references':
                return (
                    <div className="space-y-4">
                        <div>
                            <h4 className="theme-accent font-semibold mb-2">Cheat Sheets</h4>
                            <div className="space-y-2">
                                {resources.cheatSheets?.map((sheet, idx) => (
                                    <div key={idx} className="theme-surface p-2 rounded border theme-border">
                                        <a
                                            href={sheet.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="theme-accent hover:opacity-80 text-sm flex items-center justify-between"
                                        >
                                            <span>{sheet.name}</span>
                                            <FaExternalLinkAlt className="text-xs" />
                                        </a>
                                        <p className="theme-text-secondary text-xs mt-1">{sheet.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="theme-accent font-semibold mb-2">Community</h4>
                            <div className="space-y-2">
                                {resources.community?.map((community, idx) => (
                                    <div key={idx} className="theme-surface p-2 rounded border theme-border">
                                        <a
                                            href={community.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="theme-accent hover:opacity-80 text-sm flex items-center justify-between"
                                        >
                                            <span>{community.name}</span>
                                            <FaExternalLinkAlt className="text-xs" />
                                        </a>
                                        <p className="theme-text-secondary text-xs mt-1">{community.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`group relative animate-fade-in-up animation-delay-${index * 200}`}>
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

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
            <div className="relative theme-surface backdrop-blur-sm rounded-3xl p-6 border theme-border hover:theme-shadow-lg transition-all duration-500 group-hover:scale-105">

                {/* Category Badge */}
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-500/20 theme-text-secondary px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm border theme-border">
                        {category}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <FaStar className="text-sm" />
                        <span className="text-sm font-bold">{rating}</span>
                    </div>
                </div>

                {/* Course Image */}
                <div className="relative mb-4 flex justify-center">
                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl group-hover:opacity-50 transition-opacity"></div>
                        <img
                            src={image}
                            alt={title}
                            className="relative w-20 h-20 object-contain rounded-2xl shadow-lg"
                        />
                    </div>
                </div>

                {/* Course Title */}
                <h3 className="text-xl font-bold theme-text mb-2 transition-colors font-space leading-tight">
                    {title}
                </h3>

                {/* Course Description */}
                <p className="theme-text-secondary text-sm leading-relaxed mb-4 font-inter transition-colors line-clamp-3">
                    {desc}
                </p>

                {/* Progress Bar */}
                {progress && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm theme-text-secondary font-inter">Progress</span>
                            <span className="text-sm font-bold theme-text">{progress}%</span>
                        </div>
                        <div className="w-full theme-surface rounded-full h-2 overflow-hidden border theme-border">
                            <div
                                className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full transition-all duration-1000 group-hover:animate-pulse`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Course Meta Info */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                            <FaClock className="text-blue-400 text-sm" />
                        </div>
                        <div className="text-xs theme-text-secondary font-inter">{duration}</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                            <FaUsers className="text-green-400 text-sm" />
                        </div>
                        <div className="text-xs text-gray-400 font-inter">{students}</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                            <FaGraduationCap className="theme-accent text-sm" />
                        </div>
                        <div className={`text-xs bg-gradient-to-r ${getDifficultyColor(difficulty)} bg-clip-text text-transparent font-bold`}>
                            {difficulty}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-4">
                    <button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                        onClick={() => router.push(`/courses/${name}`)}
                    >
                        <FaCode className="text-sm" />
                        <span>Start Learning</span>
                    </button>
                    <button
                        className="theme-surface hover:theme-surface-elevated theme-text p-2 rounded-xl transition-all duration-300"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowResources(!showResources);
                        }}
                    >
                        {showResources ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>

                {/* Expandable Resources Section */}
                {showResources && (
                    <div className="border-t theme-border pt-4 mt-4">
                        <h4 className="theme-text font-semibold mb-3 flex items-center gap-2">
                            <FaBook className="theme-accent" />
                            Learning Resources
                        </h4>

                        {/* Resource Tabs */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <ResourceTab tabKey="introduction" tabName="Intro" icon={FaBook} />
                            <ResourceTab tabKey="getting-started" tabName="Setup" icon={FaCode} />
                            <ResourceTab tabKey="concepts" tabName="Concepts" icon={FaGraduationCap} />
                            <ResourceTab tabKey="tutorials" tabName="Practice" icon={FaArrowRight} />
                            <ResourceTab tabKey="videos" tabName="Videos" icon={FaVideo} />
                            <ResourceTab tabKey="references" tabName="Refs" icon={FaExternalLinkAlt} />
                        </div>

                        {/* Resource Content */}
                        <div className="max-h-96 overflow-y-auto theme-surface rounded-lg p-4 border theme-border">
                            <ResourceContent />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCard;