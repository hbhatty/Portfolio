import Link from "next/link";
import AiUsageHeatmap from "./components/AiUsageHeatmap";
import { getAllBlogPosts } from "./lib/blog";
import ThemeToggle from "./components/ThemeToggle";

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
    name: "Grindfolio",
    href: "https://github.com/hbhatty/Grindfolio",
  },
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
  const posts = getAllBlogPosts();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
        <header>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-medium tracking-tight text-heading">
              Harshdeep Bhatty
            </h1>
            <ThemeToggle />
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            just a curious person who likes learning new things.
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

          <div className="mt-8">
            <AiUsageHeatmap />
          </div>
        </header>

        <div className="mt-20 space-y-20">
          <section id="work" aria-labelledby="work-heading">
            <h2
              id="work-heading"
              className="text-sm font-medium uppercase tracking-widest text-muted"
            >
              Work
            </h2>
            <ol className="mt-5 divide-y divide-border border-y border-border">
              {work.map((item) => (
                <li key={`${item.company}-${item.period}`} className="py-5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-heading underline-offset-4 hover:underline"
                    >
                      {item.company}
                    </a>
                    <span className="shrink-0 font-mono text-xs text-muted">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.role}</p>
                  <p className="mt-2 font-mono text-xs leading-5 text-muted">
                    {item.tools.join(" · ")}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section id="projects" aria-labelledby="projects-heading">
            <h2
              id="projects-heading"
              className="text-sm font-medium uppercase tracking-widest text-muted"
            >
              Projects
            </h2>
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {projects.map((project) => (
                <li key={project.name} className="py-5">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-heading underline-offset-4 hover:underline"
                  >
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section id="writing" aria-labelledby="writing-heading">
            <div className="flex items-baseline justify-between gap-6">
              <h2
                id="writing-heading"
                className="text-sm font-medium uppercase tracking-widest text-muted"
              >
                Writing
              </h2>
              <Link
                href="/blog"
                className="font-mono text-xs text-muted underline-offset-4 hover:text-heading hover:underline"
              >
                All writing →
              </Link>
            </div>
            {posts.length > 0 && (
              <ol className="mt-5 divide-y divide-border border-y border-border">
                {posts.slice(0, 1).map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                        <h3 className="text-sm text-heading underline-offset-4 group-hover:underline">
                          {post.title}
                        </h3>
                        <time
                          dateTime={post.publishedAt}
                          className="shrink-0 font-mono text-xs text-muted"
                        >
                          {post.displayDate}
                        </time>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section id="education" aria-labelledby="education-heading">
            <h2
              id="education-heading"
              className="text-sm font-medium uppercase tracking-widest text-muted"
            >
              Education
            </h2>
            <div className="mt-5 border-y border-border py-5">
              {education.map((item) => (
                <div key={item.school}>
                  <div className="flex items-baseline justify-between gap-6">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-heading underline-offset-4 hover:underline"
                    >
                      {item.school}
                    </a>
                    <span className="shrink-0 font-mono text-xs text-muted">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.program}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-20">
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted">
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
                className="text-sm text-heading underline decoration-subtle underline-offset-4 hover:decoration-heading"
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
