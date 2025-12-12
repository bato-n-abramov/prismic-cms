"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { usePathname, useRouter } from "next/navigation";

export default function LenisProvider({ children }) {
    const lenisRef = useRef(null);
    const rafRef = useRef(0);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const lenis = new Lenis({
            smoothWheel: true,
            smoothTouch: false,
            lerp: 0.12,
        });

        lenisRef.current = lenis;

        const raf = (time) => {
            lenis.raf(time);
            rafRef.current = requestAnimationFrame(raf);
        };
        rafRef.current = requestAnimationFrame(raf);

        const scrollToHash = async (hash, { updateUrl = true } = {}) => {
            if (!hash || hash === "#") return;

            const rawId = hash.slice(1);
            const id = decodeURIComponent(rawId);

            const maxFrames = 60;
            let el = null;

            for (let i = 0; i < maxFrames; i++) {
                el = document.getElementById(id) || document.querySelector(hash);
                if (el) break;
                await new Promise((r) => requestAnimationFrame(r));
            }

            if (!el) return;

            if (updateUrl) history.pushState(null, "", hash);

            lenis.scrollTo(el, {
                offset: -80,
                duration: 1.0,
                easing: (t) => 1 - Math.pow(1 - t, 3),
            });
        };

        const onClick = (e) => {
            if (e.defaultPrevented) return;
            if (e.button !== 0) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            const a = e.target.closest("a");
            if (!a) return;

            if (a.dataset.noLenisAnchor === "true") return;

            const hrefAttr = a.getAttribute("href");
            if (!hrefAttr) return;

            if (a.target === "_blank" || a.hasAttribute("download")) return;
            if (/^(mailto:|tel:|javascript:)/i.test(hrefAttr)) return;

            let url;
            try {
                url = new URL(hrefAttr, window.location.href);
            } catch {
                return;
            }

            const isSameOrigin = url.origin === window.location.origin;
            if (!isSameOrigin) return;

            const hasHash = !!url.hash;
            if (!hasHash) return;

            if (url.pathname !== window.location.pathname) {
                e.preventDefault();
                router.push(url.pathname + url.search + url.hash);
                return;
            }

            e.preventDefault();
            scrollToHash(url.hash);
        };

        const onHashChange = () => {
            scrollToHash(window.location.hash, { updateUrl: false });
        };

        document.addEventListener("click", onClick, true);
        window.addEventListener("hashchange", onHashChange);

        if (window.location.hash) {
            requestAnimationFrame(() => scrollToHash(window.location.hash, { updateUrl: false }));
        }

        return () => {
            document.removeEventListener("click", onClick, true);
            window.removeEventListener("hashchange", onHashChange);
            cancelAnimationFrame(rafRef.current);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [router]);

    useEffect(() => {
        if (!lenisRef.current) return;
        if (window.location.hash) {
            requestAnimationFrame(() => {
                const evt = new Event("hashchange");
                window.dispatchEvent(evt);
            });
        }
    }, [pathname]);

    return children;
}
