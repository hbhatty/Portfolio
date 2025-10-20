const clientID = process.env.CLIENT_ID;
const experiences = [
    {
      date: 'May 2025 — August 2025',
      title: 'ATS Corporation',
      companyLink: 'https://www.atslifesciences.com/',
      position: 'Software Engineer Intern',
      description:
        '🔨 Worked on a Configuration tool for Symphoni (ATS’s automation platform).',
      tech: ['Microsoft SQL Server', 'ASP.NET Core MVC', 'TypeScript', 'EF Core', 'React'],
      image: `https://cdn.brandfetch.io/atsautomation.com?c=${clientID}`,
      
    },
    {
      date: 'Jan 2025 — May 2025',
      title: 'Toyota Motor Manufacturing Canada',
      companyLink: 'https://tmmc.ca/en/',
      position: 'Information Systems Engineering Intern',
      description:
        '🐈 Contributed to CAT (Current Analysis Tool) and worked on a predictive model for power consumption at a primary production line.',
      tech: ['TensorFlow', 'Docker', 'Pandas', 'Python', 'Numpy', 'Redis'],
      image: `https://cdn.brandfetch.io/tmmc.ca?c=${clientID}`,
    },
    {
        date: 'Jun 2024 — Aug 2024',
        title: 'University of Guelph',
        companyLink: 'https://www.uoguelph.ca/',
        position: 'Website Redesign Coordinator Intern',
        description:
          '🌿 Led web redesign initiatives for multiple departments within the OAC (Ontario Agriculture College).',
        tech: ['JavaScript', 'HTML/CSS', 'Drupal'],
        image: `https://cdn.brandfetch.io/uoguelph.ca/logo?c=${clientID}`,
      },
      {
        date: 'Sep 2023 — Dec 2023',
        title: 'Candescent (formerly NCR Voyix)',
        companyLink: 'https://www.candescent.com/',
        position: 'Software Engineer Intern',
        description:
          '💳 Worked on microservice endpoints for customer transactions.',
        tech: ['Spring Boot', 'Kubernetes', 'PostgreSQL', 'Docker', 'Helm', 'Java', 'GCP'],
        image: `https://cdn.brandfetch.io/ncrvoyix.com?c=${clientID}`,
      },
  ];

  export default function ExperienceSection() {
    return (
      <section id="experience" className="space-y-10 w-[120%]">
        {experiences.map((exp, idx) => (
          <div key={idx} className="group flex flex-col md:flex-row md:items-start gap-6 p-4 rounded-lg transition-all duration-300 hover:bg-white/5">
            <div className="w-full md:w-2/4 text-sm text-gray-400 font-mono">
              {exp.date}
              {exp.image && (
                <div className="mt-4 w-32 h-32 overflow-hidden flex items-center justify-center ml-6 rounded-full">
                  <img 
                    src={exp.image} 
                    alt={`${exp.title} logo`}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
  
            <div className="w-full md:w-3/4 space-y-2">
              <a
                href={exp.companyLink}
                target="_blank"
                rel="noreferrer"
                className="group/link flex items-center gap-2 text-lg text-white font-semibold hover:text-cyan-400 transition-colors duration-300 flex-shrink-0"
              >
                {exp.title}
                <svg 
                  className="w-4 h-4 text-cyan-400 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" 
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
              </a>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{exp.position}</p>
              <p className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">{exp.description}</p>
  
              <div className="text-center">
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {exp.tech.map((tech, techIdx) => (
                    <span
                      key={techIdx}
                      className="bg-cyan-900/40 text-cyan-300 px-3 py-1 rounded-full text-xs font-mono group-hover:bg-cyan-900/60 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-center mt-8">
          <a
            href={"https://drive.google.com/file/d/1Jh-CsSTTo0-iOwSCRVq51FGPliRnY7Sd/view?usp=sharing"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-cyan-900/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors duration-300 font-mono"
          >
            View Full Résumé
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </section>
    );
  }
  
  