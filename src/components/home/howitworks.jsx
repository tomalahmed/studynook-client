import { MousePointerClick, ScanSearch, Sparkles } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Find Your Spot",
    description:
      "Browse by library, floor, or mood. Filter for silence levels or tech amenities.",
    icon: ScanSearch,
    iconClass:
      "bg-primary-container text-on-primary-container candy-shadow-primary",
    badgeClass: "bg-primary text-on-primary",
  },
  {
    step: 2,
    title: "Book Instantly",
    description:
      "Secure your room with a single click. Receive your digital key code immediately.",
    icon: MousePointerClick,
    iconClass:
      "bg-secondary-container text-on-secondary-container candy-shadow-secondary",
    badgeClass: "bg-secondary text-on-primary",
  },
  {
    step: 3,
    title: "Study Sweetly",
    description:
      "Show up and get productive. Enjoy your private, distraction-free space.",
    icon: Sparkles,
    iconClass:
      "bg-tertiary-container text-on-tertiary-container candy-shadow-tertiary",
    badgeClass: "bg-tertiary text-on-primary",
  },
];

function StepCard({ step, title, description, icon: Icon, iconClass, badgeClass }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div
        className={`relative mb-6 flex h-24 w-24 items-center justify-center rounded-full ${iconClass}`}
      >
        <Icon className="h-12 w-12" strokeWidth={1.5} aria-hidden />
        <div
          className={`absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background text-lg font-bold ${badgeClass}`}
        >
          {step}
        </div>
      </div>
      <h3 className="mb-3 text-2xl font-bold">{title}</h3>
      <p className="text-on-surface-variant">{description}</p>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="bg-background px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-extrabold md:text-5xl">How It Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-on-surface-variant">
            Your path to the perfect study session in three simple steps.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
          {steps.map((item) => (
            <StepCard key={item.step} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
