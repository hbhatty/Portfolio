const experiences = [
    {
      date: 'May 2025 — PRESENT',
      title: 'ATS Corporation',
      companyLink: 'https://www.atslifesciences.com/',
      position: 'Software Engineer Intern',
      description:
        'Working on the UI for Symphoni, a digital assembly automation technology that features an unmatched combination of speed, versatiltiy, and precision.',
      tech: ['TypeScript', 'React', '.NET', 'Tailwind CSS', ],
    },
    {
      date: 'Jan 2025 — May 2025',
      title: 'Toyota Motor Manufacturing Canada',
      companyLink: 'https://tmmc.ca/en/',
      position: 'Information Systems Engineering Intern',
      description:
        'Worked on refining a LSTM model to predict anomalies in machinery. Also worked on a linear regression model to predict power consumption for certain shops.',
      tech: ['Python', 'Redis', 'TensorFlow', 'Docker', 'Pandas', 'Numpy'],
    },
    {
        date: 'Jun 2024 — Aug 2024',
        title: 'University of Guelph',
        companyLink: 'https://cloudflare.com',
        position: 'Website Redesign Coordinator Intern',
        description:
          '',
        tech: ['Python', 'AWS', 'Splunk', 'Burp Suite'],
      },
      {
        date: 'Sep 2023 — Dec 2023',
        title: 'NCR Voyix',
        companyLink: 'https://cloudflare.com',
        position: 'Software Engineer Intern',
        description:
          '',
        tech: ['Docker', 'Java', 'Spring Boot', 'Kubernetes', 'GCP'],
      },
  ];

  export default function ExperienceSection() {
    return (
      <section id="experience" className="space-y-10 w-[120%]">
        {experiences.map((exp, idx) => (
          <div key={idx} className="group flex flex-col md:flex-row md:items-start gap-6 p-4 rounded-lg transition-all duration-300 hover:bg-white/5">
            <div className="w-full md:w-2/4 text-sm text-gray-400 font-mono">
              {exp.date}
            </div>
  
            <div className="w-full md:w-3/4 space-y-2">
              <a
                href={exp.companyLink}
                target="_blank"
                rel="noreferrer"
                className="text-lg text-white font-semibold hover:text-cyan-400 transition-colors duration-300"
              >
                {exp.title}
              </a>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{exp.position}</p>
              <p className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">{exp.description}</p>
  
              <div className="text-center">
                <div className="flex flex-wrap justify-center gap-2 mt-2">
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
            href="/resume.pdf"
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
  
  