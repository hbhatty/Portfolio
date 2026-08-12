const work = [
  {
    company: "Geotab",
    role: "Software Engineer Intern",
    period: "January 2026 - Present",
    href: "https://www.geotab.com/",
    tools: [
      "TypeScript",
      "C#",
      "React",
      "ASP.NET",
      "PostgreSQL",
      "BigQuery",
      "Jest",
      "Sentry",
    ],
  },
  {
    company: "ATS Corporation",
    role: "Software Engineer Intern",
    period: "May 2025 - August 2025",
    href: "https://www.atslifesciences.com/",
    tools: [
      "C#",
      "TypeScript",
      "React",
      "ASP.NET Core MVC",
      "EF Core",
      "SQL Server",
    ],
  },
  {
    company: "Toyota Motor Manufacturing Canada",
    role: "Information Systems Engineering Intern",
    period: "January 2025 - May 2025",
    href: "https://tmmc.ca/en/",
    tools: [
      "Python",
      "TensorFlow",
      "Pandas",
      "NumPy",
      "SQL Server",
      "Redis",
      "Docker",
    ],
  },
  {
    company: "University of Guelph",
    role: "Website Redesign Coordinator Intern",
    period: "June 2024 - August 2024",
    href: "https://www.uoguelph.ca/",
    tools: ["HTML", "CSS", "JavaScript", "Drupal"],
  },
  {
    company: "Candescent (Formerly NCR Voyix)",
    role: "Software Engineer Intern",
    period: "September 2023 - December 2023",
    href: "https://www.candescent.com/",
    tools: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
      "Helm",
      "Google Cloud",
    ],
  },
];

const education = [
  {
    school: "University of Guelph",
    program: "Bachelor of Computing",
    period: "Present",
    href: "https://www.uoguelph.ca/",
  },
];

const projects = [
  {
    name: "Pokemon TCG Searcher",
    href: "https://github.com/hbhatty/pokemon-tcg",
  },
  {
    name: "DevReplay",
    href: "https://github.com/hbhatty/DevReplay",
  },
  {
    name: "Eco Drive",
    href: "https://github.com/neh-desai/Eco-Drive",
  },
];

const socials = [
  { label: "GitHub", href: "https://github.com/hbhatty" },
  { label: "LinkedIn", href: "https://linkedin.com/in/hbhatty" },
  { label: "Email", href: "mailto:harshbhatty2@gmail.com" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
        <header>
          <h1 className="text-2xl font-medium tracking-tight text-white">
            Harshdeep Bhatty
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            i like learning and exploring.
          </p>

          {/* Re-enable once these values come from real activity data.
          <div
            className="mt-6 flex flex-nowrap items-center gap-1 overflow-x-auto whitespace-nowrap font-mono text-[10px] sm:text-xs"
            aria-label="Current activity"
          >
            <span className="text-zinc-500">currently</span>
            <span className="bg-emerald-500 px-1.5 py-0.5 text-black">
              online
            </span>
            <span className="text-zinc-500">playing</span>
            <span className="bg-indigo-500 px-1.5 py-0.5 text-white">
              nothing rn
            </span>
            <span className="text-zinc-500">coding</span>
            <span className="bg-sky-500 px-1.5 py-0.5 text-black">
              portfolio v2
            </span>
            <span className="text-zinc-500">listening to</span>
            <span className="bg-emerald-500 px-1.5 py-0.5 text-black">
              nothing rn
            </span>
          </div>
          */}
        </header>

        <div className="mt-20 space-y-20">
          <section id="work" aria-labelledby="work-heading">
            <h2
              id="work-heading"
              className="text-sm font-medium uppercase tracking-widest text-zinc-500"
            >
              Work
            </h2>
            <ol className="mt-5 divide-y divide-white/10 border-y border-white/10">
              {work.map((item) => (
                <li key={`${item.company}-${item.period}`} className="py-5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-zinc-100 underline-offset-4 hover:underline"
                    >
                      {item.company}
                    </a>
                    <span className="shrink-0 font-mono text-xs text-zinc-500">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{item.role}</p>
                  <p className="mt-2 font-mono text-xs leading-5 text-zinc-400">
                    {item.tools.join(" · ")}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section id="projects" aria-labelledby="projects-heading">
            <h2
              id="projects-heading"
              className="text-sm font-medium uppercase tracking-widest text-zinc-500"
            >
              Projects
            </h2>
            <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
              {projects.map((project) => (
                <li key={project.name} className="py-5">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-zinc-100 underline-offset-4 hover:underline"
                  >
                    {project.name}
                  </a>
                  <p className="mt-1 font-mono text-xs text-zinc-500">
                    GitHub repository
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section id="education" aria-labelledby="education-heading">
            <h2
              id="education-heading"
              className="text-sm font-medium uppercase tracking-widest text-zinc-500"
            >
              Education
            </h2>
            <div className="mt-5 border-y border-white/10 py-5">
              {education.map((item) => (
                <div key={item.school}>
                  <div className="flex items-baseline justify-between gap-6">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-zinc-100 underline-offset-4 hover:underline"
                    >
                      {item.school}
                    </a>
                    <span className="shrink-0 font-mono text-xs text-zinc-500">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{item.program}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        <footer className="mt-20">
          <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            Contact
          </h2>
          <nav
            aria-label="Contact links"
            className="mt-5 flex flex-wrap gap-x-5 gap-y-2"
          >
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto:") ? undefined : "noreferrer"}
                className="text-sm text-zinc-100 underline decoration-zinc-600 underline-offset-4 hover:decoration-zinc-100"
              >
                {social.label}
              </a>
            ))}
          </nav>
        </footer>
      </div>
    </main>
  );
}
