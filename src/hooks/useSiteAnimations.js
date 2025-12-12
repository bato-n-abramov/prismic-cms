"use client";

import { useEffect } from "react";
import { animate, inView } from "motion";
import { usePathname } from "next/navigation";

export default function useSiteAnimations(rootRef) {
    const pathname = usePathname();

    useEffect(() => {
        const root = rootRef?.current || document;
        const elements = root.querySelectorAll?.(".site-animation.fade-up");
        if (!elements || !elements.length) return;

        const cleanups = [];

        elements.forEach((el) => {

            el.dataset.animated = "0";

            el.style.opacity = "0";
            el.style.transform = "translateY(50%)";
            el.style.willChange = "transform, opacity";

            const delayMs = el.dataset.delay ? Number(el.dataset.delay) : 0;
            const delay = Number.isFinite(delayMs) ? delayMs / 1000 : 0;

            const stop = inView(
                el,
                () => {
                    if (el.dataset.animated === "1") return;

                    el.dataset.animated = "1";
                    el.classList.add("animated");

                    animate(
                        el,
                        { opacity: [0, 1], transform: ["translateY(50%)", "translateY(0)"] },
                        { duration: 0.6, easing: "ease-out", delay }
                    );

                    stop?.();
                },
                { margin: "0px 0px -10% 0px" }
            );

            cleanups.push(() => stop?.());
        });

        return () => {
            cleanups.forEach((fn) => fn?.());
        };
    }, [pathname, rootRef]);
}
