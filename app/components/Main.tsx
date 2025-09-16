import ExperienceSection from "./Experience";
import Projects from "./Projects";
export default function MainContent() {
  return (
    <div className="w-2/3 py-20 space-y-20 text-gray-300">
      <section id="about" className="w-[120%]">
        <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            Welcome to my corner of the internet!
          </p>
          <p>
            Grab a coffee ☕ get comfy 🛌 and enjoy my site!
          </p>
          <p>
            I'm Harshdeep Bhatty, a full-time learner of all things.
            I'm currently pursuing my Bachelor of Computing at the University of Guelph.
          </p>
          <p>
            My journey so far has spanned multiple domains, from full-stack development to machine learning to leading a redesign initiative.
            I've had the chance to work with a variety of technologies, all which are listed below.
            I like to take on challenging problems and solve them to the best of my ability.
          </p>
          <p>
          I'm a firm believer in Kaizen, which has taught me that big growth comes from small, consistent improvements. It’s a mindset that's at the core of who I am.
          </p>
          <p>
            When I'm not coding, you'll find me watching sports/e-sports, playing games, or taking long walks to clear my mind.
          </p>
        </div>
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
