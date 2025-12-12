"use client";
import useSiteAnimations from "@/hooks/useSiteAnimations";
import { useEffect, useRef } from "react";
import { PrismicRichText } from "@prismicio/react";
import Image from "next/image";
import "./story-intro.scss";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const StoryIntro = ({ slice }) => {
  const rootRef = useRef(null);

  useSiteAnimations(rootRef);

  const {
    pretitle,
    title,
    text,
    subtitle,
    description_top,
    description_bottom,
    image,
    items,
    logos,
  } = slice.primary;

  const cards = items || [];
  const logoItems = logos || [];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const topEl = root.querySelector(".story-intro__description--top");
    const bottomEl = root.querySelector(".story-intro__description--bottom");

    const splitToChars = (el) => {
      const text = el?.textContent || "";
      const frag = document.createDocumentFragment();
      const chars = [];

      el.textContent = "";

      for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        if (ch === " ") {
          frag.appendChild(document.createTextNode(" "));
          continue;
        }

        const span = document.createElement("span");
        span.className = "split-char";
        span.textContent = ch;
        frag.appendChild(span);
        chars.push(span);
      }

      el.appendChild(frag);
      return chars;
    };

    let topChars = [];
    let bottomChars = [];

    if (topEl) topChars = splitToChars(topEl);
    if (bottomEl) bottomChars = splitToChars(bottomEl);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.querySelector(".story-intro__middle") || root,
        start: "top bottom",
        end: "bottom center",
        scrub: 1,
      },
    });

    if (topChars.length) {
      tl.fromTo(
        topChars,
        { color: "#353535" },
        { color: "#B3B3B3", stagger: 0.03, duration: 1, ease: "none" }
      );
    }

    if (bottomChars.length) {
      tl.fromTo(
        bottomChars,
        { color: "#353535" },
        { color: "#FA7911", stagger: 0.03, duration: 1, ease: "none" },
        "+=0.1"
      );
    }

    const numbers = root.querySelectorAll(".animated-number");

    const animateNumber = (el, start, end, duration) => {
      const isInteger = Number.isInteger(end);
      const range = end - start;
      let startTime = null;

      const step = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const current = start + range * progress;

        const displayValue = isInteger
          ? Math.floor(current)
          : Math.round(current * 100) / 100;

        el.textContent = String(displayValue);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = isInteger ? String(end) : end.toFixed(2);
        }
      };

      requestAnimationFrame(step);
    };

    const numberTriggers = [];
    numbers.forEach((el) => {
      const end = parseFloat(String(el.textContent).replace(",", "."));
      if (Number.isNaN(end)) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => animateNumber(el, 0, end, 2500),
      });

      numberTriggers.push(st);
    });

    return () => {
      numberTriggers.forEach((t) => t.kill());
      tl.scrollTrigger?.kill();
      tl.kill();

      if (topEl) topEl.textContent = topEl.textContent;
      if (bottomEl) bottomEl.textContent = bottomEl.textContent;
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="story-intro"
      id="story-intro"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="story-intro__inner">
        <div className="container">
          {pretitle && (
            <p className="site-text pretitle story-intro__pretitle site-animation fade-up">{pretitle}</p>
          )}

          {title && (
            <div className="story-intro__title site-title site-animation fade-up" data-delay="200">
              <PrismicRichText field={title} />
            </div>
          )}

          {text && <p className="site-text big story-intro__text site-animation fade-up" data-delay="300">{text}</p>}

          <div className="story-intro__middle site-animation fade-up" data-delay="400">
            <div className="story-intro__middle-left">
              {subtitle && <p className="site-text story-intro__subtitle">{subtitle}</p>}
            </div>

            <div className="story-intro__middle-right">
              {description_top && (
                <p className="story-intro__description story-intro__description--top">
                  {description_top}
                </p>
              )}

              {description_bottom && (
                <p className="story-intro__description story-intro__description--bottom">
                  {description_bottom}
                </p>
              )}
            </div>
          </div>

          <div className="story-intro__bottom">
            {image?.url && (
              <div className="story-intro__image site-animation fade-up">
                <Image src={image.url} alt={image.alt || ""} width={700} height={700} />
              </div>
            )}

            {cards.length > 0 &&
              cards.map((item, index) => (
                <div className="story-intro__card site-animation fade-up" key={index}>
                  {item.title && (
                    <div className="site-title story-intro__card-title">
                      <span className="animated-number">{item.title}</span> <span>%</span>
                    </div>
                  )}
                  {item.text && <p className="site-text story-intro__card-text">{item.text}</p>}
                </div>
              ))}
          </div>

          {logoItems.length > 0 && (
            <div className="story-intro__logos-wrapper site-animation fade-up">
              {[0, 1, 2].map((repeatIndex) => (
                <div className="story-intro__logos-list" key={repeatIndex}>
                  {logoItems.map((item, index) => {
                    const logo = item.logo;
                    if (!logo?.url) return null;

                    return (
                      <div className="story-intro__logos-item" key={`${repeatIndex}-${index}`}>
                        <Image src={logo.url} alt={logo.alt || ""} width={300} height={300} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StoryIntro;
