'use client'
import { useState, useEffect } from 'react'

export default function Sidebar() {
    const [activeSection, setActiveSection] = useState('about');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-50% 0px -50% 0px'
            }
        );

        document.querySelectorAll('section[id]').forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="h-screen py-20 text-gray-100">
            <div>
                <span className="text-3xl font-bold">C:\Users\harsh{'>'}</span>
                <span className="inline-block w-[8px] h-[40px] bg-white cursor-blink ml-1 -my-2">
                </span>
                <h2 className="text-xl mt-1">🤓 Builder of curiosities</h2>
                <p className="text-gray-200 mt-6">I like to learn and build things I find interesting.</p>
                <nav className="mt-28 space-y-4 text-sm tracking-widest pl-14">
                    <a 
                        href="#about" 
                        className="block relative group pl-0"
                    >
                        <div className="relative flex items-center">
                            <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-cyan-400 transition-all duration-300 ${
                                activeSection === 'about' ? 'w-16' : 'w-0 group-hover:w-16'
                            }`}></span>
                            <span className={`transition-all duration-300 ${
                                activeSection === 'about' ? 'text-cyan-400 translate-x-20' : 'group-hover:text-cyan-400 group-hover:translate-x-20'
                            }`}>
                                About
                            </span>
                        </div>
                    </a>
                    <a 
                        href="#experience" 
                        className="block relative group pl-0"
                    >
                        <div className="relative flex items-center">
                            <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-cyan-400 transition-all duration-300 ${
                                activeSection === 'experience' ? 'w-16' : 'w-0 group-hover:w-16'
                            }`}></span>
                            <span className={`transition-all duration-300 ${
                                activeSection === 'experience' ? 'text-cyan-400 translate-x-20' : 'group-hover:text-cyan-400 group-hover:translate-x-20'
                            }`}>
                                Experience
                            </span>
                        </div>
                    </a>
                    <a 
                        href="#projects" 
                        className="block relative group pl-0"
                    >
                        <div className="relative flex items-center">
                            <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-cyan-400 transition-all duration-300 ${
                                activeSection === 'projects' ? 'w-16' : 'w-0 group-hover:w-16'
                            }`}></span>
                            <span className={`transition-all duration-300 ${
                                activeSection === 'projects' ? 'text-cyan-400 translate-x-20' : 'group-hover:text-cyan-400 group-hover:translate-x-20'
                            }`}>
                                Projects
                            </span>
                        </div>
                    </a>
                </nav>
                
                <div className="mt-48 pl-14">
                    <div className="flex space-x-6">
                        <a 
                            href="https://linkedin.com/in/hbhatty" 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-gray-200 hover:text-cyan-400 transition-colors duration-300"
                            aria-label="LinkedIn"
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        
                        <a 
                            href="https://github.com/hbhatty" 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-gray-200 hover:text-cyan-400 transition-colors duration-300"
                            aria-label="GitHub"
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                        
                        <a 
                            href="mailto:harshbhatty2@gmail.com" 
                            className="text-gray-200 hover:text-cyan-400 transition-colors duration-300"
                            aria-label="Email"
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.91L12 10.09l9.455-6.269h.909c.904 0 1.636.732 1.636 1.636z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
