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
        <div className="h-screen py-20 text-white">
            <div>
                <span className="text-3xl font-bold">C:\Users\harsh{'>'}</span>
                <span className="inline-block w-[8px] h-[40px] bg-white cursor-blink ml-1 -my-2">
                </span>
                <h2 className="text-xl mt-1">Full-Time Learner</h2>
                <p className="text-gray-400 mt-6">I like to build and learn things I find interesting.</p>
                <nav className="mt-20 space-y-4 text-sm tracking-widest">
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
            </div>
        </div>
    );
}
