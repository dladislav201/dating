"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "react-spring";
import "./Gallery.scss";

interface HomeUserGalleryProps {
  children: React.ReactNode;
}

const AnimatedUL = animated("ul");

export const Gallery = ({ children }: HomeUserGalleryProps) => {
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const galleryRef = useRef<HTMLLIElement>(null);
  const [itemWidth, setItemWidth] = useState(0);

  const totalItems = Array.isArray(children)
    ? children.length
    : React.Children.count(children);

  useEffect(() => {
    if (galleryRef.current) {
      setItemWidth(galleryRef.current.offsetWidth);
    }
  }, []);

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const goToSlide = (index: number) => {
    setCurrentGalleryIndex(index);
    api.start({ x: -index * itemWidth });
  };

  const bind = useDrag(
    ({ movement: [mx], direction: [dx], velocity, down, event }) => {
      event.preventDefault();

      if (!down) {
        if (Math.abs(velocity[0]) > 0.2) {
          const nextIndex =
            dx > 0 ? currentGalleryIndex - 1 : currentGalleryIndex + 1;
          const clampedIndex = Math.max(0, Math.min(nextIndex, totalItems - 1));
          goToSlide(clampedIndex);
        } else {
          goToSlide(currentGalleryIndex);
        }
      } else {
        api.start({
          x: -currentGalleryIndex * itemWidth + mx,
          immediate: true,
        });
      }
    },
    { axis: "x", eventOptions: { passive: false } }
  );

  const nextSlide = () => {
    const nextIndex = currentGalleryIndex + 1;
    const clampedIndex = Math.min(nextIndex, totalItems - 1);
    goToSlide(clampedIndex);
  };

  const prevSlide = () => {
    const prevIndex = currentGalleryIndex - 1;
    const clampedIndex = Math.max(prevIndex, 0);
    goToSlide(clampedIndex);
  };

  const isFirstSlide = currentGalleryIndex === 0;
  const isLastSlide = currentGalleryIndex === totalItems - 1;

  return (
    <AnimatedUL
      {...bind()}
      className="gallery"
      style={{
        transform: x.to((xVal) => `translate3d(${xVal}px, 0, 0)`) as any,
      }}
    >
      {children}
    </AnimatedUL>
  );
};
