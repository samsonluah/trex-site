import { Mail } from "lucide-react";

const COACHING_EMAIL = "trex.sg.run@gmail.com";

export default function CoachingPage() {
  return (
    <div className="site-container py-24">
      <p className="site-label mb-2">Services</p>
      <h1 className="site-header">Coaching.</h1>
      <p className="text-trex-muted max-w-2xl text-lg leading-relaxed mb-12">
        Whether you&apos;re preparing for your first race or chasing a new personal
        best, we offer personalised coaching plans tailored to your goals and
        schedule.
      </p>

      <div className="site-card max-w-xl">
        <p className="site-label mb-4">Get in touch</p>
        <p className="text-trex-muted mb-6">
          Interested in coaching? Drop us an email and we&apos;ll get back to you
          with more details on how we can help.
        </p>
        <a
          href={`mailto:${COACHING_EMAIL}`}
          className="site-button inline-flex items-center gap-3"
        >
          <Mail className="w-5 h-5" />
          Email us
        </a>
        <p className="text-sm text-trex-muted mt-4">
          {COACHING_EMAIL}
        </p>
      </div>
    </div>
  );
}
