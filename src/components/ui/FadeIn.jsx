"use client";

import { motion, useReducedMotion } from "framer-motion";

export function FadeIn({
  children,
  className = "",
  delay = 0,
  as = "div",
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }
      }
      className={className}
    >
      {children}
    </Component>
  );
}

export function FadeInStagger({ children, className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: reduceMotion
            ? { staggerChildren: 0 }
            : { staggerChildren: 0.08 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({ children, className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: reduceMotion ? {} : { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
