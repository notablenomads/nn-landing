import React, {useCallback, useEffect, useRef} from "react";
import { motion, useInView, useAnimationControls } from "framer-motion";

interface FilterValues {
  blur: number;
  scale: number;
  baseFreq?: number;
}

interface AnimatedTextProps {
  text: string;
  effectNumber?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  duration?: number;
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  effectNumber = 1,
  className = "",
  duration = 2,
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const animationRef = useRef<number | null>(null);

  const updateSVGFilter = (
    filterId: string,
    progress: number,
    startValues: FilterValues,
    endValues: FilterValues
  ) => {
    const filter = document.querySelector(`#${filterId}`);
    if (!filter) return;

    const feBlur = filter.querySelector("feGaussianBlur");
    const feDisplace = filter.querySelector("feDisplacementMap");
    const feTurbulence = filter.querySelector("feTurbulence");

    if (feBlur) {
      const blur =
        startValues.blur + (endValues.blur - startValues.blur) * progress;
      feBlur.setAttribute("stdDeviation", blur.toString());
    }

    if (feDisplace) {
      const scale =
        startValues.scale + (endValues.scale - startValues.scale) * progress;
      feDisplace.setAttribute("scale", scale.toString());
    }

    if (feTurbulence && startValues.baseFreq && endValues.baseFreq) {
      const freq =
        startValues.baseFreq +
        (endValues.baseFreq - startValues.baseFreq) * progress;
      feTurbulence.setAttribute("baseFrequency", freq.toString());
    }
  };

  const animate = (
    filterId: string,
    startValues: FilterValues,
    endValues: FilterValues
  ) => {
    const startTime = performance.now();
    const durationMs = duration * 1000;
    const delayMs = delay * 1000;

    const update = (currentTime: number) => {
      const elapsedSinceStart = currentTime - startTime;

      // Wait for delay
      if (elapsedSinceStart < delayMs) {
        animationRef.current = requestAnimationFrame(update);
        return;
      }

      const elapsed = elapsedSinceStart - delayMs;
      const progress = Math.min(elapsed / durationMs, 1);

      updateSVGFilter(filterId, progress, startValues, endValues);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(update);
      }
    };

    animationRef.current = requestAnimationFrame(update);
  };

  const getAnimationValues = () => {
    switch (effectNumber) {
      case 1:
        return {
          start: { blur: 50, scale: 0, baseFreq: 0 },
          end: { blur: 0, scale: 0, baseFreq: 0 },
          motion: { opacity: [0, 1] },
        };
      case 2:
        return {
          start: { blur: 20, scale: 100, baseFreq: 0.1 },
          end: { blur: 0, scale: 0, baseFreq: 0.05 },
          motion: { opacity: [0, 1], scale: [0.9, 1] },
        };
      case 3:
        return {
          start: { blur: 40, scale: 150, baseFreq: 0 },
          end: { blur: 0, scale: 0, baseFreq: 0 },
          motion: { opacity: [0, 1], scale: [0.9, 1], y: [20, 0] },
        };
      case 4:
        return {
          start: { blur: 90, scale: 300, baseFreq: 0.1 },
          end: { blur: 0, scale: 0, baseFreq: 0.01 },
          motion: { opacity: [0, 1], scaleX: [2.4, 1] },
        };
      case 5:
        return {
          start: { blur: 40, scale: 100, baseFreq: 0 },
          end: { blur: 0, scale: 0, baseFreq: 0 },
          motion: { opacity: [0, 1], scale: [0.6, 1] },
        };
      default:
        return {
          start: { blur: 0, scale: 0, baseFreq: 0 },
          end: { blur: 0, scale: 0, baseFreq: 0 },
          motion: { opacity: [0, 1] },
        };
    }
  };

  const playAnimation = useCallback(async () => {
    const filterId = `text-filter-${effectNumber}`;
    const { start, end, motion } = getAnimationValues();

    // Start SVG filter animation
    animate(filterId, start, end);

    // Start Framer Motion animation
    await controls.start({
      ...motion,
      transition: {
        duration,
        delay,
        ease: "easeOut",
      },
    });
  },[animate, controls, delay, duration, effectNumber, getAnimationValues]);

  const resetAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    controls.set({ opacity: 0 });
    setTimeout(playAnimation, 100);
  };

  useEffect(() => {
    if (isInView) {
      playAnimation();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, playAnimation]);

  return (
    <div ref={ref} className="relative">
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id={`text-filter-${effectNumber}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 1 0 1 0 0 0 0 0 18 -7"
              result="goo"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="1"
              result="noise"
            />
            <feDisplacementMap
              in="goo"
              in2="noise"
              scale="0"
              result="displacement"
            />
            <feComposite
              in="SourceGraphic"
              in2="displacement"
              operator="atop"
            />
          </filter>
        </defs>
      </svg>

      <motion.div
        animate={controls}
        initial={{ opacity: 0 }}
        className={`${className}`}
        style={{
          filter: `url(#text-filter-${effectNumber})`,
        }}
      >
        {text}
      </motion.div>

      <button
        onClick={resetAnimation}
        className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Replay
      </button>
    </div>
  );
};

export default AnimatedText;
