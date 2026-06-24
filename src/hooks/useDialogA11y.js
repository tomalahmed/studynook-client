"use client";

import { useEffect, useId, useRef } from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Escape to close, focus trap, optional body scroll lock.
 */
export function useDialogA11y(open, onClose, { lockScroll = true } = {}) {
  const panelRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const panel = panelRef.current;
    const previousActive = document.activeElement;

    if (lockScroll) {
      document.body.style.overflow = "hidden";
    }

    const focusables = panel?.querySelectorAll(FOCUSABLE);
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];
    first?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) {
        return;
      }

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (lockScroll) {
        document.body.style.overflow = "";
      }
      if (previousActive instanceof HTMLElement && document.contains(previousActive)) {
        previousActive.focus();
      }
    };
  }, [open, onClose, lockScroll]);

  return { panelRef, titleId };
}
