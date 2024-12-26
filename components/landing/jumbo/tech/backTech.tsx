import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  SiReact,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiVuedotjs,
  SiNextdotjs,
  SiWebpack,
  SiNodedotjs,
  SiMongodb,
  SiMysql,
  SiGraphql,
  SiPython,
  SiDocker,
  SiAmazon,
  SiGit,
  SiKubernetes,
  SiLinux,
  SiJenkins,
  SiNginx,
  SiRedis,
  SiTailwindcss,
  SiSass,
  SiFirebase,
  SiAngular,
  SiDjango,
  SiLaravel,
  SiSpring,
  SiAndroid,
  SiBabel,
} from "react-icons/si";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {IconType} from "react-icons";

interface TechIconsBackgroundProps {
  activeNeon?: boolean;
}

interface IconData {
  Icon: IconType;
  color: string;
  name: string;
}

interface GridItem extends IconData {
  row: number;
  col: number;
  id: string;
  initialDelay: number;
}

interface IconProps {
  icon: IconData;
  style: React.CSSProperties;
  size: number;
}

const GRID_ROWS = 6;
const GRID_COLS = 8;

const allIcons: IconData[] = [
  { Icon: SiReact, color: "#61DAFB", name: "React" },
  { Icon: SiJavascript, color: "#F7DF1E", name: "JavaScript" },
  { Icon: SiTypescript, color: "#3178C6", name: "TypeScript" },
  { Icon: SiCss3, color: "#1572B6", name: "CSS" },
  { Icon: SiHtml5, color: "#E34F26", name: "HTML" },
  { Icon: SiVuedotjs, color: "#4FC08D", name: "Vue" },
  { Icon: SiNextdotjs, color: "#000000", name: "Next.js" },
  { Icon: SiWebpack, color: "#8DD6F9", name: "Webpack" },
  { Icon: SiNodedotjs, color: "#339933", name: "Node.js" },
  { Icon: SiMongodb, color: "#47A248", name: "MongoDB" },
  { Icon: SiMysql, color: "#4479A1", name: "MySQL" },
  { Icon: SiGraphql, color: "#E10098", name: "GraphQL" },
  { Icon: SiPython, color: "#3776AB", name: "Python" },
  { Icon: SiDocker, color: "#2496ED", name: "Docker" },
  { Icon: SiAmazon, color: "#FF9900", name: "AWS" },
  { Icon: SiGit, color: "#F05032", name: "Git" },
  { Icon: SiKubernetes, color: "#326CE5", name: "Kubernetes" },
  { Icon: SiLinux, color: "#FCC624", name: "Linux" },
  { Icon: SiTailwindcss, color: "#06B6D4", name: "Tailwind" },
  { Icon: SiSass, color: "#CC6699", name: "Sass" },
  { Icon: SiAngular, color: "#DD0031", name: "Angular" },
  { Icon: SiDjango, color: "#092E20", name: "Django" },
  { Icon: SiLaravel, color: "#FF2D20", name: "Laravel" },
  { Icon: SiSpring, color: "#6DB33F", name: "Spring" },
  { Icon: SiJenkins, color: "#D24939", name: "Jenkins" },
  { Icon: SiNginx, color: "#009639", name: "Nginx" },
  { Icon: SiRedis, color: "#DC382D", name: "Redis" },
  { Icon: SiAndroid, color: "#3DDC84", name: "Android" },
  { Icon: SiBabel, color: "#F9DC3E", name: "Babel" },
  { Icon: SiFirebase, color: "#FFCA28", name: "Firebase" },
];

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

const GRID_ITEMS = createGridItems();

const Icon = memo(({ icon, style, size }: IconProps) => (
  <icon.Icon size={size} style={style} />
));

const TechIconsBackground: React.FC<TechIconsBackgroundProps> = ({
  activeNeon = false,
}) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  const getIconStyle = (icon: IconData): React.CSSProperties => {
    if (activeNeon) {
      const isLightColor =
        icon.color === "#000000" ||
        icon.color === "#010101" ||
        icon.color.toLowerCase() === "#fff" ||
        icon.color.toLowerCase() === "#ffffff";

      return {
        color: isLightColor ? "#FFFFFF" : icon.color,
        filter: `
          drop-shadow(0 0 1px #fff)
          drop-shadow(0 0 2px ${icon.color}) 
          drop-shadow(0 0 6px ${icon.color}) 
          drop-shadow(0 0 12px ${icon.color}80)
        `,
        opacity: 1,
        transition: "all 0.3s ease-out",
      };
    }

    return {
      color: "#E5E7EB",
      filter: "brightness(1.4) contrast(1.2)",
      opacity:isMobile? 0.4: 0.7,
      transition: "all 0.3s ease-out",
    };
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${
        activeNeon ? "bg-gray-900/10" : "bg-transparent"
      }`}
    >
      <div className="w-full h-full p-8">
        <div
          className="w-full h-full grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          }}
        >
          {GRID_ITEMS.map((item) => {
            const style = getIconStyle(item);

            return (
              <motion.div
                key={item.id}
                className="flex items-center justify-center w-full h-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: style.opacity, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: item.initialDelay,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <Icon icon={item} style={style} size={24} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(TechIconsBackground);
