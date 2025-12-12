"use client";

import { useEffect } from "react";

export default function useParallax(rootRef) {
    useEffect(() => {
        const root = rootRef?.current || document;
        const elements = root.querySelectorAll?.(".plx");
        if (!elements || !elements.length) return;

        let rafId = 0;

        const update = () => {
            rafId = 0;

            const scrolled = window.scrollY || window.pageYOffset || 0;

            elements.forEach((el) => {
                const parent = el.closest("section") || el.parentNode;
                if (!parent) return;

                const intensityRaw = getComputedStyle(el)
                    .getPropertyValue("--parallax-intensity")
                    .trim();

                const intensity = Number.parseFloat(intensityRaw || "0");
                if (!Number.isFinite(intensity) || intensity === 0) return;

                const speed = intensity / 10;


                const offset = parent.offsetTop * speed;
                const top = offset - scrolled * speed;

                if (getComputedStyle(parent).position === "static") {
                    parent.style.position = "relative";
                }

                el.style.transform = `translate3d(0px, ${top}px, 0px)`;
                el.style.willChange = "transform";
            });
        };

        const requestTick = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(update);
        };

        window.addEventListener("scroll", requestTick, { passive: true });
        window.addEventListener("resize", requestTick);

        requestTick();

        return () => {
            window.removeEventListener("scroll", requestTick);
            window.removeEventListener("resize", requestTick);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [rootRef]);
}
