import Image from "next/image";
import Link from "next/link";

function RocketIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M9.19 6.35c-2.04 2.29-3.44 5.04-3.57 5.89l2.26.83c.24-1.24 1.31-3.39 2.74-4.82l-1.43-1.9zm10.43 2.92-1.43-1.9c-1.43 1.43-3.58 2.5-4.82 2.74l.83 2.26c.85-.13 3.6-1.53 5.89-3.57l-1.47-1.53zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      className="h-6 w-6 text-[#0096cc]"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16">
        <div className="z-10 flex-1 text-center md:text-left">
          <span className="mb-4 inline-block rounded-full bg-[#ffd6ee] px-4 py-1.5 text-xs font-bold text-[#3d0028] sm:mb-6 sm:text-sm">
            Sweeten Your Study Session
          </span>

          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-on-surface sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
            Find Your Perfect <br />
            <span className="text-primary">Study Room</span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-on-surface-variant sm:mb-10 sm:text-lg md:mx-0 md:text-xl">
            Browse and book quiet, private study rooms in your library. List
            your own room and earn rewards while helping others succeed.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 md:justify-start">
            <Link
              href="/rooms"
              className="candy-shadow-primary flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-on-primary transition-all duration-200 hover:scale-[1.03] active:scale-95 sm:px-10 sm:py-5 sm:text-lg"
            >
              <span>Explore Rooms</span>
              <RocketIcon />
            </Link>
            <Link
              href="/about"
              className="rounded-full border-2 border-[#dcc8e0] bg-white px-8 py-4 text-base font-bold text-on-surface transition-all duration-200 hover:bg-surface-variant active:scale-95 sm:px-10 sm:py-5 sm:text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-md flex-1 pb-6 sm:max-w-lg md:max-w-xl md:pb-8">
          <div
            className="absolute inset-0 scale-95 rotate-3 rounded-xl bg-[#eedcff] opacity-20"
            aria-hidden
          />
          <div className="relative z-10 -rotate-2 overflow-hidden rounded-xl bg-[#fbf2fb] shadow-[0_8px_24px_rgba(124,82,170,0.2)]">
            <Image
              src="/images/Banner.png"
              alt="StudyNook — modern study room with pastel pink and purple accents"
              width={800}
              height={800}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 520px"
              className="h-auto w-full object-contain object-center"
            />
          </div>

          <div className="absolute -bottom-4 left-2 z-20 rounded-lg bg-[#40c0ee] p-4 shadow-[0_8px_24px_rgba(0,150,204,0.2)] sm:-bottom-6 sm:left-0 sm:p-5 md:-left-4 lg:-bottom-6 lg:-left-6 lg:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white sm:h-12 sm:w-12">
                <StarIcon />
              </div>
              <div className="text-[#00334d]">
                <p className="text-sm font-bold sm:text-base lg:text-lg">
                  98% Quiet
                </p>
                <p className="text-xs opacity-80 sm:text-sm">Top Rated Rooms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
