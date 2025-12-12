"use client";
import { useRef } from "react";
import useSiteAnimations from "@/hooks/useSiteAnimations";
import useParallax from "@/hooks/useParallax";
import { PrismicRichText } from "@prismicio/react";
import Image from "next/image";
import "./testimonials.scss";

const chunkIntoColumns = (arr = [], columns = 3) => {
  if (!arr.length) return [];
  const chunkSize = Math.ceil(arr.length / columns);
  const chunks = [];
  for (let i = 0; i < columns; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const part = arr.slice(start, end);
    if (part.length) chunks.push(part);
  }
  return chunks;
};

const Testimonials = ({ slice }) => {
  const { pretitle, title, items } = slice.primary;

  const list = items.length ? items : [];
  const columns = chunkIntoColumns(list, 3);

  const rootRef = useRef(null);

  useSiteAnimations(rootRef);
  useParallax(rootRef);


  return (
    <section ref={rootRef} className="testimonials" id="testimonials" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="testimonials__radial-item testimonials__radial-item_1 plx " />
      <div className="testimonials__radial-item testimonials__radial-item_2 plx " />

      <div className="container">
        <div className="testimonials__inner">
          {pretitle && (
            <div className="site-text pretitle testimonials__pretitle site-animation fade-up">
              {pretitle}
            </div>
          )}

          {title && (
            <div className="h2 site-title testimonials__title site-animation fade-up" data-delay="200">
              <PrismicRichText field={title} />
            </div>
          )}

          {columns.length > 0 && (
            <div className="testimonials__list">
              {columns.map((column, colIndex) => {
                const speedClass =
                  colIndex % 2 === 0 ? "testimonials__column_speed-f" : "testimonials__column_speed-s";

                return (
                  <div key={colIndex} className={`testimonials__column plx plx_static site-animation fade-up ${speedClass}`}>
                    {column.map((item, itemIndex) => {
                      const text = item.text;
                      const image = item.image;
                      const name = item.name;
                      const position = item.position;

                      return (
                        <div key={`${colIndex}-${itemIndex}`} className="testimonials__item">
                          {text && (
                            <div className="testimonials__item-text">
                              {text}
                            </div>
                          )}

                          <div className="testimonials__item-info">
                            {image?.url && (
                              <div className="testimonials__item-image">
                                <Image
                                  src={image.url}
                                  alt={image.alt || ""}
                                  width={80}
                                  height={80}
                                />
                              </div>
                            )}

                            <div className="testimonials__item-author">
                              {name && <div className="testimonials__item-name">{name}</div>}
                              {position && <div className="testimonials__item-position">{position}</div>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
