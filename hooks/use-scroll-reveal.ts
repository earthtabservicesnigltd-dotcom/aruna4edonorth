"use client";

import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.querySelectorAll(".rise").forEach((el) => el.classList.add("in"));
      return;
    }

    const observedSet = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -4% 0px" }
    );

    function scanElements() {
      const elements = document.querySelectorAll(".rise:not(.in)");
      elements.forEach((el) => {
        if (!observedSet.has(el)) {
          observedSet.add(el);
          observer.observe(el);
        }
      });
    }

    // Initial scan
    scanElements();

    // Observe dynamic DOM changes for async components
    const mutationObserver = new MutationObserver(() => {
      scanElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}