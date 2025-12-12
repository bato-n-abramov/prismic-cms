"use client";
import { useRef } from "react";
import useSiteAnimations from "@/hooks/useSiteAnimations";
import { PrismicRichText } from "@prismicio/react";
import Image from "next/image";
import "./hero.scss";

const Hero = ({ slice }) => {
  const { title, text, button_link } = slice.primary;

  const rootRef = useRef(null);

  useSiteAnimations(rootRef);

  const richField = (field) => (field?.value ? field.value : field);
  const link = button_link?.value ? button_link.value : button_link;

  const buttonUrl = link?.url;
  const buttonLabel = link?.text || "Learn more";

  return (
    <section ref={rootRef} className="hero" id="hero">
      <div className="hero__gradient"><Image src="/hero-gradient.png" alt="" width={300} height={300} /></div>
      <div className="hero__wrapper">
        <div className="container">
          <div className="hero__inner">
            <div className="hero__decor"><Image src={"/hero-decor.svg"} alt="" width={300} height={300} /></div>
            {title && (
              <div className="site-title hero__title site-animation fade-up">
                <PrismicRichText field={richField(title)} />
              </div>
            )}

            {text && (
              <div className="site-text hero__text site-animation fade-up" data-delay="200">
                <PrismicRichText field={richField(text)} />
              </div>
            )}

            {buttonUrl && (
              <a href={buttonUrl} className="site-button white hero__cta site-animation fade-up" data-delay="300">
                {buttonLabel}
              </a>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
