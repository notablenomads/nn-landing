import React, { memo, useDeferredValue, useMemo } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import allIcons, { IconData } from "@/components/landing/jumbo/tech/icons";

interface TechIconsBackgroundProps {
  activeNeon?: boolean;
}

interface GridItem extends IconData {
  row: number;
  col: number;
  id: string;
  initialDelay: number;
}

interface IconProps {
  icon: IconData;
  isNeon: boolean;
  opacity: number;
  delay: number;
}

const GRID_ROWS = 6;
const GRID_COLS = 8;

// Create grid items once, outside the component
const createGridItems = (): GridItem[] => {
  const gridItems: GridItem[] = [];
  const totalCells = GRID_ROWS * GRID_COLS;
  const iconCount = allIcons.length;

  for (let i = 0; i < totalCells; i++) {
    const row = Math.floor(i / GRID_COLS);
    const col = i % GRID_COLS;
    const iconIndex = i % iconCount;

    gridItems.push({
      ...allIcons[iconIndex],
      row,
      col,
      id: `${row}-${col}`,
      initialDelay: (row + col) * 0.1,
    });
  }

  return gridItems;
};

const STATIC_GRID_ITEMS = createGridItems();

const IconComponent = memo(({ icon, isNeon, opacity, delay }: IconProps) => {
  const variants = {
    neon: {
      color:
        icon.color === "#000000" ||
        icon.color === "#010101" ||
        icon.color.toLowerCase() === "#fff" ||
        icon.color.toLowerCase() === "#ffffff"
          ? "#FFFFFF"
          : icon.color,
      filter: `drop-shadow(0 0 1px #fff) 
              drop-shadow(0 0 2px ${icon.color}) 
              drop-shadow(0 0 6px ${icon.color}) 
              drop-shadow(0 0 12px ${icon.color}80)`,
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: delay,
        ease: "easeInOut" as const,
      },
    },
    normal: {
      color: "#E5E7EB",
      filter: "brightness(1.4) contrast(1.2)",
      opacity: opacity,
      transition: {
        duration: 0.3,
        delay: delay,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="normal"
      animate={isNeon ? "neon" : "normal"}
    >
      <icon.Icon size={24} />
    </motion.div>
  );
});

IconComponent.displayName = "IconComponent";

const GridItemComponent = memo(
  ({
    item,
    isNeon,
    opacity,
  }: {
    item: GridItem;
    isNeon: boolean;
    opacity: number;
  }) => {
    // Calculate delay based on row and column for both initial and state changes
    const transitionDelay = item.initialDelay;

    return (
      <motion.div
        layout
        key={item.id}
        className="flex items-center justify-center w-full h-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: transitionDelay,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        <IconComponent
          icon={item}
          isNeon={isNeon}
          opacity={opacity}
          delay={transitionDelay}
        />
      </motion.div>
    );
  }
);

GridItemComponent.displayName = "GridItemComponent";

const TechIconsBackground: React.FC<TechIconsBackgroundProps> = memo(
  ({ activeNeon = false }) => {
    const isMobile = useMediaQuery("(max-width:768px)");
    const deferredNeon = useDeferredValue(activeNeon);
    const opacity = useMemo(() => (isMobile ? 0.35 : 0.4), [isMobile]);

    const gridStyle = useMemo(
      () => ({
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
      }),
      []
    );

    // Only memoize the mapping of static items
    const gridItems = useMemo(
      () =>
        STATIC_GRID_ITEMS.map((item) => (
          <GridItemComponent
            key={item.id}
            item={item}
            isNeon={deferredNeon}
            opacity={opacity}
          />
        )),
      [deferredNeon, opacity]
    );

    // Container variants for staggered children
    const containerVariants = {
      normal: {
        backgroundColor: "rgba(17, 24, 39, 0)",
        transition: { duration: 0.3 },
      },
      neon: {
        backgroundColor: "rgba(17, 24, 39, 0.1)",
        transition: { duration: 0.3 },
      },
    };

    return (
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        variants={containerVariants}
        initial="normal"
        animate={deferredNeon ? "neon" : "normal"}
      >
        <div className="w-full h-full p-8">
          <motion.div className="grid h-full w-full gap-4" style={gridStyle}>
            {gridItems}
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

TechIconsBackground.displayName = "TechIconsBackground";

export default TechIconsBackground;
