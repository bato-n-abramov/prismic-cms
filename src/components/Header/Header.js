"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Header = ({ settings }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef(null);

    const logo = settings?.header_logo;
    const navItems = settings?.header_nav || [];
    const ctaLink = settings?.header_cta;

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const OFFSET = 50;
        header.classList.add("sticky");

        let prev = window.scrollY || window.pageYOffset || 0;
        let ticking = false;

        const update = () => {
            ticking = false;

            // ✅ когда меню открыто — никогда не прячем хедер
            if (menuOpen) {
                header.classList.add("sticky");
                return;
            }

            const current = window.scrollY || window.pageYOffset || 0;

            if (current > OFFSET) {
                if (prev < current) header.classList.remove("sticky");
                else header.classList.add("sticky");
            } else {
                header.classList.add("sticky");
            }

            prev = current;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [menuOpen]); // ✅ важно

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    if (!settings) return null;

    return (
        <header
            ref={headerRef}
            className={`header site-header ${menuOpen ? "menu-open sticky" : ""}`} // ✅ можно форсить sticky классом тоже
        >
            <div className="container">
                <div className="header__inner">
                    <Link href="/" className="header__logo" onClick={closeMenu}>
                        {logo?.url && (
                            <Image
                                src={logo.url}
                                alt={logo.alt || "Stepwise"}
                                className="header__logo-img"
                                width={300}
                                height={300}
                                priority
                            />
                        )}
                    </Link>

                    {/* ✅ button вместо div */}
                    <button
                        type="button"
                        className="header__burger"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((v) => !v)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>

                    <div className="header__nav-wrapper">
                        <nav className="header__nav" aria-label="Main navigation">
                            {navItems.map((item, index) => {
                                const href = item?.link?.url || "#";
                                const label = item?.link?.text || "";
                                if (!label) return null;

                                return (
                                    <Link
                                        key={index}
                                        href={href}
                                        className="header__link"
                                        onClick={closeMenu}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {ctaLink?.url && (
                            <a
                                href={ctaLink.url}
                                className="site-button header__cta"
                                onClick={closeMenu}
                            >
                                {ctaLink.text}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
