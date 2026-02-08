'use client';
import CourseCard from './CourseCard';
import { FaCode, FaGraduationCap, FaTrophy, FaUsers, FaRocket, FaStar, FaChevronRight, FaBullseye } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';

const page = () => {
    const router = useRouter();
    const { isDark } = useTheme();

    // Function to scroll to courses section
    const scrollToCourses = () => {
        const coursesSection = document.getElementById('courses-section');
        if (coursesSection) {
            coursesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const courses = [
        {
            name: "cpp",
            title: "Master C++",
            desc: "Dive deep into the world of systems programming with C++. Learn object-oriented programming, memory management, and advanced features that power modern applications.",
            progress: 50,
            image: '/cpp.png',
            difficulty: "Advanced",
            duration: "12 weeks",
            students: "45K+",
            rating: 4.8,
            category: "Systems Programming",
            featured: true
        },
        {
            name: "python",
            title: "Python Mastery",
            desc: "From data science to web development, Python is your gateway to infinite possibilities. Master the most versatile programming language in the world.",
            image: '/python.png',
            progress: 70,
            difficulty: "Beginner",
            duration: "10 weeks",
            students: "89K+",
            rating: 4.9,
            category: "General Purpose",
            featured: true
        },
        {
            name: "javascript",
            title: "JavaScript Excellence",
            desc: "Become a full-stack JavaScript developer. Master ES6+, React, Node.js, and build dynamic web applications that users love.",
            image: '/javascript.png',
            progress: 30,
            difficulty: "Intermediate",
            duration: "14 weeks",
            students: "67K+",
            rating: 4.7,
            category: "Web Development",
            featured: false
        },
        {
            name: "java",
            title: "Java Enterprise",
            desc: "Build scalable enterprise applications with Java. Learn Spring, microservices, and enterprise patterns used by Fortune 500 companies.",
            image: '/java.png',
            progress: 90,
            difficulty: "Advanced",
            duration: "16 weeks",
            students: "32K+",
            rating: 4.6,
            category: "Enterprise",
            featured: false
        },
        {
            name: "c",
            title: "C Programming Fundamentals",
            desc: "Master the foundation of all programming languages. Learn C programming, pointers, memory management, and system-level programming.",
            image: '/c.png',
            progress: 80,
            difficulty: "Intermediate",
            duration: "8 weeks",
            students: "28K+",
            rating: 4.5,
            category: "System Programming",
            featured: false
        },
        {
            name: "rust",
            title: "Rust Systems Programming",
            desc: "Embrace memory safety and performance with Rust. Build blazing-fast, secure systems software with zero-cost abstractions and fearless concurrency.",
            image: '/rust.png',
            progress: 25,
            difficulty: "Advanced",
            duration: "14 weeks",
            students: "18K+",
            rating: 4.9,
            category: "Systems Programming",
            featured: true,
            isNew: true
        },
        {
            name: "go",
            title: "Go for Modern Development",
            desc: "Master Google's Go language for cloud computing and microservices. Learn concurrent programming, networking, and building scalable backend systems.",
            image: '/go.png',
            progress: 40,
            difficulty: "Intermediate",
            duration: "10 weeks",
            students: "24K+",
            rating: 4.7,
            category: "Backend Development",
            featured: false,
            isNew: true
        },
        {
            name: "solidity",
            title: "Solidity Blockchain Development",
            desc: "Enter the world of Web3 and DeFi. Learn Solidity to build smart contracts, DApps, and blockchain applications on Ethereum and other platforms.",
            image: '/solidity.png',
            progress: 15,
            difficulty: "Advanced",
            duration: "12 weeks",
            students: "12K+",
            rating: 4.6,
            category: "Blockchain",
            featured: true,
            isNew: true
        },
        {
            name: "csharp",
            title: "C# .NET Development",
            desc: "Build powerful Windows applications and web services with C#. Master .NET framework, ASP.NET, and enterprise-grade application development.",
            image: '/csharp.png',
            progress: 60,
            difficulty: "Intermediate",
            duration: "13 weeks",
            students: "35K+",
            rating: 4.5,
            category: "Enterprise Development",
            featured: false,
            isNew: true
        }
    ]

    const stats = [
        { icon: FaUsers, number: "150K+", label: "Active Learners", color: "purple" },
        { icon: FaCode, number: "9+", label: "Programming Languages", color: "blue" },
        { icon: FaTrophy, number: "95%", label: "Success Rate", color: "green" },
        { icon: FaGraduationCap, number: "1000+", label: "Certificates Issued", color: "pink" }
    ];

    return (
        <main className="min-h-screen theme-bg relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{ background: isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.06)' }}></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000" style={{ background: isDark ? 'rgba(236, 72, 153, 0.07)' : 'rgba(236, 72, 153, 0.05)' }}></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full blur-2xl animate-bounce" style={{ background: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)' }}></div>
            </div>

            {/* Hero Section */}
            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full border backdrop-blur-sm animate-premium-glow" style={{ background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)', borderColor: 'var(--border-primary)' }}>
                        <FaBullseye className="text-xl animate-pulse" style={{ color: 'var(--accent)' }} />
                        <span className="font-bold text-lg tracking-wide font-space" style={{ color: 'var(--accent)' }}>LEARN & GROW</span>
                    </div>

                    <h1 className="text-7xl max-md:text-6xl max-sm:text-5xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-space tracking-tight animate-shimmer">
                        Master Programming
                    </h1>

                    <h2 className="text-6xl max-md:text-5xl max-sm:text-4xl font-black mb-8 bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-space tracking-tight animate-shimmer animation-delay-500">
                        Shape Your Future
                    </h2>

                    <p className="text-xl max-md:text-lg max-w-4xl mx-auto leading-relaxed font-inter font-light mb-12" style={{ color: 'var(--text-secondary)' }}>
                        Unlock your potential with our comprehensive programming courses. From
                        <span className="theme-accent font-semibold"> beginner-friendly tutorials</span> to
                        <span className="text-pink-400 font-semibold"> advanced masterclasses</span>,
                        we've got everything you need to become a coding champion.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-6 max-sm:flex-col max-sm:w-full justify-center animate-fade-in-up animation-delay-1000">
                        <button 
                            className="group relative overflow-hidden"
                            onClick={scrollToCourses}
                        >
                            <div className="absolute inset-0 bg-blue-600 hover:bg-blue-700 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                            <div className="relative bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                                <FaRocket className="group-hover:animate-bounce" />
                                Start Learning Now
                            </div>
                        </button>

                        <button 
                            className="backdrop-blur-sm font-semibold py-4 px-8 rounded-xl hover:scale-105 transition-all duration-300 group flex items-center gap-2"
                            style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                            onClick={scrollToCourses}
                        >
                            <FaGraduationCap className="group-hover:rotate-12 transition-transform" />
                            View Curriculum
                        </button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 max-w-5xl mx-auto">
                    {stats.map((stat, index) => (
                        <div key={index} className={`text-center animate-fade-in-up animation-delay-${(index + 1) * 500} group`}>
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="text-white text-2xl" />
                            </div>
                            <div className={`text-4xl font-black bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 bg-clip-text text-transparent font-mono`}>
                                {stat.number}
                            </div>
                            <p className="mt-2 font-inter" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Courses Section */}
                <div className="mb-16" id="courses-section">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-space">
                            Programming Courses
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto font-inter" style={{ color: 'var(--text-secondary)' }}>
                            Master cutting-edge programming languages and build your dream career in tech
                        </p>
                    </div>

                    {/* Featured Courses Banner */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-6 py-3 rounded-full border border-yellow-400/30 backdrop-blur-sm">
                            <FaStar className="text-yellow-400 animate-pulse" />
                            <span className="text-yellow-400 font-bold font-space">Featured & Trending Courses</span>
                            <FaStar className="text-yellow-400 animate-pulse" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 max-w-8xl mx-auto">
                        {courses.map((course, index) => (
                            <CourseCard
                                key={index}
                                name={course.name}
                                title={course.title}
                                desc={course.desc}
                                progress={course.progress}
                                image={course.image}
                                difficulty={course.difficulty}
                                duration={course.duration}
                                students={course.students}
                                rating={course.rating}
                                category={course.category}
                                featured={course.featured}
                                isNew={course.isNew}
                                index={index}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center py-20">
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-4xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-space">
                            Ready to Transform Your Career?
                        </h3>
                        <p className="text-xl mb-8 font-inter" style={{ color: 'var(--text-secondary)' }}>
                            Join thousands of developers who have accelerated their careers with UPCODE
                        </p>
                        <button 
                            className="group relative"
                            onClick={() => router.push('/premium')}
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 rounded-3xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                            <div className="relative rounded-3xl px-12 py-6 text-white font-bold text-xl border backdrop-blur-sm flex items-center gap-3"
                                style={{ background: 'linear-gradient(135deg, var(--accent-dark), var(--accent))', borderColor: 'var(--border-primary)' }}>
                                <span>Get Started Today</span>
                                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default page