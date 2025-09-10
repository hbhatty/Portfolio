import Terminal from "./Terminal";
import ExperienceSection from "./Experience";
import Projects from "./Projects";
export default function MainContent() {
  return (
    <div className="w-2/3 py-20 space-y-32 text-gray-300">
      {/* Sections */}
      <section id="about" className="w-[120%]">
        <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
            <Terminal />
      </section>
      <section id="experience">
        <h2 className="text-3xl font-bold text-white mb-6">Experience</h2>
        <ExperienceSection />
      </section>
      <section id="projects">
        <h2 className="text-3xl font-bold text-white mb-6">Projects</h2>
        <Projects />
      </section>
    </div>
  );
}
