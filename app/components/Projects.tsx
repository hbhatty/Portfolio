import Image from 'next/image';
const projects = [
    {
      name: 'Company Dashboard',  
      image: '/images/companydashboard.png',
      description:
        'A comprehensive multi-role dashboard that enables users to view and manage different departments, student information, and administrative data through an intuitive interface.',
      tech: ['Python (Flask)', 'HTML/CSS', 'Pandas', 'PostgreSQL'],
      link: 'https://github.com/hbhatty/pokemon-tcg'
    },
    {
        name: 'Pokemon TCG Searcher',  
        image: '/images/tcgpic.png',
        description:
          'An interactive Pokemon card search platform where users can search for their favorite Pokemon and view all associated cards. Features include filtering by rarity and artist, user authentication, and the ability to save favorite cards to a personal collection.',
        tech: ['TypeScript', 'React', 'Tailwind CSS', 'PostgreSQL', 'Docker'],
        link: 'https://github.com/hbhatty/pokemon-tcg'
      },
  ];

  export default function Projects() 
  {
    return (
        <section className="space-y-8 md:space-y-10 w-full md:w-[120%]">
             {projects.map((project, idx) => (
          <a 
            key={idx} 
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-white/5 active:bg-white/5 cursor-pointer"
          >
            <div className="w-full md:w-2/4 text-sm text-gray-400 font-mono">
              {project.image && (
                <div className="relative inline-block group-hover:bg-white/10 group-active:bg-white/10 rounded-lg transition-all duration-300 p-0.5">
                  <Image 
                    src={project.image} 
                    alt={`${project.name} screenshot`}
                    className="w-full max-w-[192px] md:w-48 h-auto md:h-32 object-cover rounded-lg"
                    width={192}
                    height={128}
                    unoptimized
                  />
                </div>
              )}
            </div>

            <div className="w-full md:w-3/4 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg text-white font-semibold group-hover:text-cyan-400 group-active:text-cyan-400 transition-colors duration-300">
                  {project.name}
                </h3>
                <svg 
                  className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{project.description}</p>
  
              <div className="text-center">
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {project.tech.map((tech, techIdx) => (
                    <span
                      key={techIdx}
                      className="bg-cyan-900/40 text-cyan-300 px-2 md:px-3 py-1 rounded-full text-xs font-mono group-hover:bg-cyan-900/60 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </a>
        ))}
        </section>
    );
  }