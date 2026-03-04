import { Mail, Target, Users, TrendingUp } from "lucide-react";

const COACHING_EMAIL = "trex.sg.run@gmail.com";

const FEATURES = [
  {
    icon: Target,
    title: "Personalised Plans",
    description:
      "Tailored training programmes built around your goals, fitness level, and schedule.",
  },
  {
    icon: TrendingUp,
    title: "Race Prep",
    description:
      "Structured periodisation to peak on race day, from 5K to marathon distances.",
  },
  {
    icon: Users,
    title: "Group Training",
    description:
      "Join our weekly group sessions for speed work, tempo runs, and long runs.",
  },
];

export default function CoachingPage() {
  return (
    <div>
      {/* Dark hero */}
      <section className="bg-[#080808] pt-32 pb-20">
        <div className="site-container-wide">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-trex-accent">
            Services
          </span>
          <h1 className="editorial-heading text-7xl md:text-9xl text-white mt-2 mb-6">
            Coaching
          </h1>
          <p className="text-white/50 max-w-2xl text-sm leading-relaxed">
            Whether you&apos;re preparing for your first race or chasing a new
            personal best, we offer personalised coaching plans tailored to your
            goals and schedule.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="bg-[#080808] pb-24">
        <div className="site-container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-xl p-8 hover:border-trex-accent/30 transition-colors duration-300"
              >
                <feature.icon className="w-6 h-6 text-trex-accent mb-4" />
                <h3 className="font-display font-bold text-xl uppercase text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[#0a0a0a] py-20">
        <div className="site-container-wide text-center">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-trex-accent block mb-4">
            Get in touch
          </span>
          <h2 className="editorial-heading text-4xl md:text-6xl text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-8">
            Drop us an email and we&apos;ll get back to you with more details on
            how we can help.
          </p>
          <a
            href={`mailto:${COACHING_EMAIL}`}
            className="inline-flex items-center gap-3 bg-trex-accent text-[#080808] font-mono text-xs tracking-[0.15em] uppercase py-3.5 px-8 rounded-full hover:bg-white transition-colors duration-200"
          >
            <Mail className="w-4 h-4" />
            Email us
          </a>
          <p className="font-mono text-xs text-white/30 mt-4">
            {COACHING_EMAIL}
          </p>
        </div>
      </section>
    </div>
  );
}
