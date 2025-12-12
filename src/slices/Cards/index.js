"use client";
import { useRef } from "react";
import useSiteAnimations from "@/hooks/useSiteAnimations";
import useParallax from "@/hooks/useParallax";
import { PrismicRichText } from "@prismicio/react";
import Link from "next/link";
import Image from "next/image";
import "./cards.scss";

const Cards = ({ slice }) => {
  const {
    pretitle,
    title,
    text,
    items,
    cta,
    subtext,
  } = slice.primary;

  const cards = items || [];

  const rootRef = useRef(null);

  useSiteAnimations(rootRef);
  useParallax(rootRef);


  return (
    <section
      className="cards"
      id="cards"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={rootRef}
    >
      <div className="cards__radial-item cards__radial-item_1 plx plx_slowest"></div>
      <div className="cards__radial-item cards__radial-item_2 plx plx_slow"></div>
      <div className="container">
        <div className="cards__inner">
          {pretitle && (
            <p className="site-text pretitle cards__pretitle site-animation fade-up">
              {pretitle}
            </p>
          )}

          {title && (
            <div className="cards__title site-title site-animation fade-up" data-delay="100">
              <PrismicRichText field={title} />
            </div>
          )}

          {text && (
            <p className="site-text big cards__text site-animation fade-up" data-delay="200">
              {text}
            </p>
          )}

          {cards.length > 0 && (
            <div className="cards__list">
              {cards.map((item, index) => (
                <div className="cards__item site-animation fade-up" data-delay={index * 100} key={index}>
                  {item.icon?.url && (
                    <div className="cards__item-icon">
                      <Image
                        src={item.icon.url}
                        alt={item.icon.alt || ""}
                        width={64}
                        height={64}
                      />
                    </div>
                  )}

                  {item.title && (
                    <h3 className="site-title cards__item-title">
                      {item.title}
                    </h3>
                  )}

                  {item.text && (
                    <p className="site-text cards__item-text">
                      {item.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {(cta || subtext) && (
            <div className="cards__footer">
              {cta && (

                <Link
                  href={cta.url}
                  className="site-button white cards__cta site-animation fade-up"
                  data-delay="500"
                  {...cta.target}
                >
                  {cta.text}
                </Link>
              )}

              {subtext && (
                <p className="site-text small cards__subtext site-animation fade-up" data-delay="600">
                  {subtext}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cards;
