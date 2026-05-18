"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

const usefulLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/about", label: "About" },
];

const socialLinks = [
  { href: "https://facebook.com", icon: faFacebook, label: "Facebook" },
  { href: "https://x.com", icon: faXTwitter, label: "X" },
  { href: "https://linkedin.com", icon: faLinkedin, label: "LinkedIn" },
  { href: "https://instagram.com", icon: faInstagram, label: "Instagram" },
];

function StudyNookLogo({ className = "size-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g clipPath="url(#clip0_footer_logo)">
        <path
          clipRule="evenodd"
          d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="clip0_footer_logo">
          <rect fill="white" height="48" width="48" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 flex flex-col gap-8 border-t border-[#dcc8e0] px-4 py-12">
      <div className="flex flex-col justify-between gap-10 md:flex-row">
        <div className="flex max-w-sm flex-col gap-4">
          <div className="flex items-center gap-3 text-primary">
            <StudyNookLogo />
            <h2 className="text-xl font-black text-on-surface">StudyNook</h2>
          </div>
          <p className="text-sm font-medium leading-relaxed text-on-surface-variant">
            The ultimate platform for finding, booking, and managing study
            spaces. Empowering students to achieve more in spaces they love.
          </p>
          <div className="mt-2 flex gap-4">
            {socialLinks.map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant text-[#7c52aa] transition-all hover:bg-primary hover:text-white"
              >
                <FontAwesomeIcon icon={icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">
              Useful links
            </h3>
            {usefulLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">
              Contact
            </h3>
            <a
              href="mailto:hello@studynook.com"
              className="text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
            >
              hello@studynook.com
            </a>
            <a
              href="tel:+15551234567"
              className="text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
            >
              +1 (555) 123-4567
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm font-medium text-on-surface-variant leading-relaxed">
        <p>© 2026 StudyNook Inc. All rights reserved.</p>
        <p>Designed & built by <Link href="https://natomal-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Tomal.</Link></p>
      </div>
    </footer>
  );
}
