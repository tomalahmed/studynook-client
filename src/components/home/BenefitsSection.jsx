import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faLock,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

const benefits = [
  {
    title: "Double-booking protection",
    description:
      "Smart scheduling ensures your space is strictly yours. No more awkward interruptions.",
    icon: faShieldHalved,
    iconBg: "bg-primary",
    shadow: "shadow-[0_4px_16px_rgba(224,64,160,0.2)]",
  },
  {
    title: "Easy management",
    description:
      "Book, cancel, or extend your sessions with a single tap from any device.",
    icon: faCalendarDays,
    iconBg: "bg-[#7c52aa]",
    shadow: "shadow-[0_4px_16px_rgba(124,82,170,0.15)]",
  },
  {
    title: "Secure authentication",
    description:
      "University-grade security keeps your data and bookings private and safe.",
    icon: faLock,
    iconBg: "bg-[#0096cc]",
    shadow: "shadow-[0_4px_16px_rgba(0,150,204,0.15)]",
  },
];

function BenefitCard({ title, description, icon, iconBg, shadow }) {
  return (
    <article
      className={`flex flex-1 flex-col gap-5 rounded-lg border border-[#dcc8e0] bg-[#fbf2fb] p-6 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:scale-[1.02] sm:p-8 ${shadow}`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-on-primary ${iconBg}`}
      >
        <FontAwesomeIcon icon={icon} className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black leading-tight text-on-surface">
          {title}
        </h2>
        <p className="text-base font-medium leading-relaxed text-on-surface-variant">
          {description}
        </p>
      </div>
    </article>
  );
}

export default function BenefitsSection() {
  return (
    <section className="@container flex flex-col gap-8 px-4 py-12 sm:gap-10 sm:py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="rounded-full bg-[#ffd6ee] px-4 py-1 text-xs font-black uppercase tracking-widest text-[#3d0028]">
          Benefits
        </span>
        <h2 className="max-w-[720px] text-[28px] font-black leading-tight tracking-tight text-on-background sm:text-[32px] @[480px]:text-4xl">
          Study Smarter, Not Harder
        </h2>
        <p className="max-w-[600px] text-base font-medium text-on-surface-variant sm:text-lg">
          Our platform makes room booking a delight with tools designed for your
          peak productivity.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.title} {...benefit} />
        ))}
      </div>
    </section>
  );
}
