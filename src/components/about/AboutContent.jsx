import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faEnvelope,
  faPhone,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const highlights = [
  {
    title: "For students",
    description:
      "Browse quiet zones, compare amenities, and reserve hourly slots that fit your schedule.",
    accent: "bg-primary-container text-on-primary-container",
  },
  {
    title: "For room owners",
    description:
      "List a space you manage, set your hourly rate, and let StudyNook handle booking conflicts.",
    accent: "bg-secondary-container text-on-secondary-container",
  },
  {
    title: "For libraries",
    description:
      "Give members a modern, mobile-friendly way to discover and book study rooms online.",
    accent: "bg-tertiary-container text-on-tertiary-container",
  },
];

const values = [
  {
    icon: faCalendarCheck,
    title: "Conflict-free booking",
    text: "Overlapping reservations are blocked automatically so every session stays yours.",
  },
  {
    icon: faUsers,
    title: "Community-driven spaces",
    text: "Rooms are listed by real students and members who know their library best.",
  },
  {
    icon: faEnvelope,
    title: "Always reachable",
    text: "Questions about listings or bookings? Our team is one message away.",
  },
];

export default function AboutContent() {
  return (
    <div className="overflow-hidden">
      <section className="relative px-4 py-16 sm:px-6 sm:py-24">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-container opacity-40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-secondary-container opacity-50 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center">
          <div className="flex-1 text-center lg:text-left">
            <span className="mb-4 inline-block rounded-full bg-primary-container px-4 py-1.5 text-xs font-bold text-on-primary-container">
              About StudyNook
            </span>
            <h1 className="mb-6 text-4xl font-black tracking-tight text-on-surface md:text-5xl lg:text-6xl">
              Sweet spaces for{" "}
              <span className="text-primary">serious study</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg font-medium leading-relaxed text-on-surface-variant">
              StudyNook connects library members who have study rooms to share
              with students who need a quiet, bookable place to focus. List,
              discover, and reserve — without double-booking or messy
              spreadsheets.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/rooms"
                className="rounded-full bg-primary px-8 py-4 font-black text-on-primary candy-shadow-primary transition-transform hover:scale-[1.03] active:scale-95"
              >
                Explore Rooms
              </Link>
              <Link
                href="/add-room"
                className="rounded-full border-2 border-secondary/20 bg-white px-8 py-4 font-black text-secondary transition-transform hover:scale-[1.03] active:scale-95"
              >
                List Your Room
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-lg flex-1">
            <div className="overflow-hidden rounded-xl border-8 border-white candy-shadow-secondary">
              <Image
                src="/images/library.png"
                alt="Students studying in a bright library space"
                width={640}
                height={480}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-variant px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-[#dcc8e0] bg-white p-8 candy-shadow-secondary"
            >
              <span
                className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-black ${item.accent}`}
              >
                {item.title}
              </span>
              <p className="text-base font-medium leading-relaxed text-on-surface-variant">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-center text-3xl font-black text-on-surface md:text-4xl">
            What we stand for
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map(({ icon, title, text }) => (
              <article
                key={title}
                className="flex flex-col items-center rounded-xl bg-white p-8 text-center candy-shadow-secondary"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary">
                  <FontAwesomeIcon icon={icon} className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-black text-on-surface">
                  {title}
                </h3>
                <p className="text-base font-medium leading-relaxed text-on-surface-variant">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="rounded-xl border-8 border-white bg-white p-8 md:p-12 candy-shadow-primary">
          <h2 className="mb-6 text-2xl font-black text-primary md:text-3xl">
            Get in touch
          </h2>
          <p className="mb-8 max-w-2xl text-lg font-medium text-on-surface-variant">
            Whether you are listing your first room or booking a weekly focus
            block, we are happy to help.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
            <a
              href="mailto:hello@studynook.com"
              className="flex items-center gap-3 font-bold text-on-surface transition-colors hover:text-primary"
            >
              <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-primary" />
              hello@studynook.com
            </a>
            <a
              href="tel:+15551234567"
              className="flex items-center gap-3 font-bold text-on-surface transition-colors hover:text-primary"
            >
              <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-secondary" />
              +1 (555) 123-4567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
