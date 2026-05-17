import React, { useState } from "react";
import { FaAws } from "react-icons/fa6";
import { VscAzure } from "react-icons/vsc";
import { IconType } from "react-icons";
import {
  SiAngular,
  SiBitbucket,
  SiChakraui,
  SiConfluence,
  SiDart,
  SiDocker,
  SiExpress,
  SiFlutter,
  SiGit,
  SiGithub,
  SiGitlab,
  SiGooglecloud,
  SiJenkins,
  SiJira,
  SiKubernetes,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTrello,
  SiTypescript,
  SiUbuntu,
  SiVite,
  SiVuedotjs,
  SiWebpack,
  SiOpenai,
  SiPython,
} from "react-icons/si";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ServiceItem {
  title: string;
  description: string;
}

interface Service {
  title: string;
  items: ServiceItem[];
  icons: Array<{
    Icon: IconType;
    color: string;
  }>;
}

interface ServiceCardProps extends Omit<Service, "icons"> {
  onHover: (title: string | null) => void;
  index: number;
}

interface IconsLayoutProps {
  activeService: string | null;
  services: Service[];
}

const services: Service[] = [
  {
    title: "Backend, Cloud-Native & AI Services",
    items: [
      {
        title: "AI & Machine Learning Solutions",
        description:
          "Building intelligent applications with LLMs, custom ML models, RAG systems, and AI agents using OpenAI, PyTorch, and TensorFlow.",
      },
      {
        title: "Cloud-Native Application Development",
        description:
          "Building scalable applications using cloud-native principles and microservices architecture.",
      },
      {
        title: "Backend Development",
        description:
          "Developing robust backend solutions with Node.js, NestJS, Express.js, and modern databases.",
      },
      {
        title: "Cloud Infrastructure Management",
        description:
          "Managing cloud platforms like Azure, AWS, and GCP with expertise in Kubernetes and Docker.",
      },
    ],
    icons: [
      { Icon: FaAws, color: "#FF9900" },
      { Icon: VscAzure, color: "#0078D4" },
      { Icon: SiGooglecloud, color: "#4285F4" },
      { Icon: SiDocker, color: "#2496ED" },
      { Icon: SiKubernetes, color: "#326CE5" },
      { Icon: SiNodedotjs, color: "#339933" },
      { Icon: SiNestjs, color: "#E0234E" },
      { Icon: SiExpress, color: "#FFF" },
      { Icon: SiMongodb, color: "#47A248" },
      { Icon: SiPostgresql, color: "#4169E1" },
      { Icon: SiOpenai, color: "#412991" },
      { Icon: SiPython, color: "#3776AB" },
    ],
  },
  {
    title: "Frontend Development Services",
    items: [
      {
        title: "Modern Web & Mobile Application Development",
        description:
          "Creating interactive, scalable frontends using React.js, Next.js, Flutter, and TypeScript.",
      },
      {
        title: "UI/UX Development",
        description:
          "Developing cross-platform user interfaces with Flutter, Tailwind, MUI, Chakra UI, and Ant Design.",
      },
      {
        title: "Frontend Performance Optimization",
        description:
          "Improving performance with modern bundlers and compilation techniques for web and mobile platforms.",
      },
      {
        title: "Cross-Platform Mobile Development",
        description:
          "Building native-quality mobile applications using Flutter and Dart for iOS and Android platforms.",
      },
    ],
    icons: [
      { Icon: SiReact, color: "#61DAFB" },
      { Icon: SiNextdotjs, color: "#FFF" },
      { Icon: SiTypescript, color: "#3178C6" },
      { Icon: SiTailwindcss, color: "#06B6D4" },
      { Icon: SiChakraui, color: "#319795" },
      { Icon: SiVite, color: "#646CFF" },
      { Icon: SiWebpack, color: "#8DD6F9" },
      { Icon: SiVuedotjs, color: "#4FC08D" },
      { Icon: SiAngular, color: "#DD0031" },
      { Icon: SiFlutter, color: "#02569B" },
      { Icon: SiDart, color: "#0175C2" },
    ],
  },
  {
    title: "Team as a Service (TaaS)",
    items: [
      {
        title: "End-to-End Project Development",
        description:
          "Providing full-stack expertise for complete software project development.",
      },
      {
        title: "Consulting and System Design",
        description:
          "Offering system design, architecture consulting, and technical leadership.",
      },
      {
        title: "Team Augmentation",
        description:
          "Integrating seamlessly with client teams for frontend, backend, or DevOps support.",
      },
    ],
    icons: [
      { Icon: SiGit, color: "#F05032" },
      { Icon: SiGithub, color: "#FFF" },
      { Icon: SiGitlab, color: "#FC6D26" },
      { Icon: SiBitbucket, color: "#0052CC" },
      { Icon: SiJira, color: "#0052CC" },
      { Icon: SiConfluence, color: "#172B4D" },
      { Icon: SiJenkins, color: "#D24939" },
      { Icon: SiTrello, color: "#0052CC" },
      { Icon: SiUbuntu, color: "#E95420" },
    ],
  },
];

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  items,
  onHover,
  index,
}) => {
  const getBorderClasses = (idx: number) => {
    const baseClasses =
      "relative bg-gray-800/80 backdrop-blur-sm p-8 rounded-lg overflow-hidden min-h-[500px] border-3 border-transparent before:absolute before:inset-0 before:border-2 before:border-transparent before:rounded-lg before:transition-all before:duration-500 before:ease-in-out after:absolute after:inset-0 after:border-2 after:border-transparent after:rounded-lg after:transition-all after:duration-500 after:delay-100 after:ease-in-out transition-transform duration-300 hover:scale-[1.02]";
    const hoverClasses: Record<number, string> = {
      0: "hover:before:border-t-secondary hover:after:border-t-secondary",
      1: "hover:before:border-x-secondary hover:after:border-x-secondary",
      2: "hover:before:border-b-secondary hover:after:border-b-secondary",
    };
    return `${baseClasses} ${hoverClasses[idx]}`;
  };

  return (
    <div
      className={getBorderClasses(index)}
      onMouseEnter={() => onHover(title)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative z-10 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <ul className="space-y-4">
          {items.map((item, idx) => (
            <li key={idx} className="text-gray-300">
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const IconsLayout: React.FC<IconsLayoutProps> = ({
  activeService,
  services,
}) => {
  const renderIcon = (
    { Icon, color }: { Icon: IconType; color: string },
    isActive: boolean,
    index: number
  ) => {
    const style = {
      opacity: !activeService ? 0.5 : isActive ? 1 : 0.2,
      color: isActive ? color : "#666",
      transition: "all 0.3s ease-out",
      filter: isActive ? `drop-shadow(0 0 10px ${color}80)` : "none",
    };
    const is4k = useMediaQuery("(min-width: 2400px)");

    return (
      <div
        key={index}
        className="flex items-center justify-center transform hover:scale-110 transition-transform"
      >
        <Icon size={is4k ? 65 : 28} style={style} />
      </div>
    );
  };

  const getIconsForSection = (index: number) => {
    return services[index].icons.map((icon, i) =>
      renderIcon(icon, activeService === services[index].title, i)
    );
  };

  return (
    <div className="absolute inset-0 -z-10 hidden lg:block">
      <div className="absolute inset-0 bg-gray-950 backdrop-blur-sm" />
      <div className="absolute inset-0 flex flex-col">
        {/* Top section */}
        <div className="grid grid-cols-12 gap-4 p-4">
          {getIconsForSection(0)}
        </div>

        {/* Middle section */}
        <div className="flex-1 flex justify-between px-4">
          <div className="grid grid-rows-6 gap-4">
            {services[1].icons
              .slice(0, 6)
              .map((icon, i) =>
                renderIcon(icon, activeService === services[1].title, i + 12)
              )}
          </div>

          <div className="grid grid-rows-5 gap-4">
            {services[1].icons
              .slice(6)
              .map((icon, i) =>
                renderIcon(icon, activeService === services[1].title, i + 18)
              )}
          </div>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-9 gap-4 p-4">
          {getIconsForSection(2)}
        </div>
      </div>
    </div>
  );
};

const ThirdSection: React.FC = () => {
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <section
      className="relative min-h-dvh p-8 py-14 overflow-hidden flex justify-center items-center"
      id="services"
    >
      <IconsLayout activeService={activeService} services={services} />
      <div className="relative z-10 flex-col flex justify-center">
        <h2 className="text-5xl text-center font-bold tracking-tight text-white mb-4">
          Our Services
        </h2>
        <div className="text-center text-white text-md mb-5">
          We provide the best digital solutions.
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              {...service}
              onHover={setActiveService}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;
