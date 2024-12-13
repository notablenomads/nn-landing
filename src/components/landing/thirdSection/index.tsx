import React, { useState, useRef } from "react";

interface ServiceItem {
  title: string;
  description: string;
}

interface Service {
  title: string;
  items: ServiceItem[];
}

const services: Service[] = [
  {
    title: "Backend and Cloud-Native Services",
    items: [
      {
        title: "Cloud-Native Application Development",
        description:
            "Building scalable applications using cloud-native principles and microservices architecture.",
      },
      {
        title: "Backend Development",
        description:
            "Developing robust backend solutions with Node.js, NestJS, and Express.js.",
      },
      {
        title: "Cloud Infrastructure Management",
        description:
            "Managing cloud platforms like Azure, AWS, and GCP with expertise in Kubernetes and Docker.",
      },
    ],
  },
  {
    title: "Frontend Development Services",
    items: [
      {
        title: "Modern Web Application Development",
        description:
            "Creating interactive, scalable frontends using React.js, Next.js, and TypeScript.",
      },
      {
        title: "UI/UX Development",
        description:
            "Developing user interfaces with frameworks like Tailwind, MUI, Chakra UI, and Ant Design.",
      },
      {
        title: "Frontend Performance Optimization",
        description:
            "Improving performance with modern bundlers like Webpack, TurboPack, and Vite.",
      },
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
  },
];


interface ServiceCardProps {
  title: string;
  items: ServiceItem[];
}

interface MousePosition {
  x: number;
  y: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, items }) => {
  const [mousePos, setMousePos] = useState<MousePosition>({
    x: -1000,
    y: -1000,
  });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!cardRef.current) return;
    const bounds = cardRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const padding = 50;
    if (
      x >= -padding &&
      x <= bounds.width + padding &&
      y >= -padding &&
      y <= bounds.height + padding
    ) {
      setMousePos({ x, y });
    } else {
      setMousePos({ x: -1000, y: -1000 });
    }
  };

  const handleMouseLeave = (): void => {
    setMousePos({ x: -1000, y: -1000 });
  };

  return (
    <div id='services'
      ref={cardRef}
      className="relative bg-gray-800 p-8 rounded-lg overflow-hidden min-h-[600px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* RGB Border Effects */}
      <div
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          border: "2px solid rgb(255, 50, 50)",
          maskImage: `radial-gradient(
            120px circle at ${mousePos.x - 4}px ${mousePos.y - 1}px,
            black,
            transparent
          )`,
          WebkitMaskImage: `radial-gradient(
            120px circle at ${mousePos.x - 4}px ${mousePos.y - 1}px,
            black,
            transparent
          )`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          border: "2px solid rgb(50, 255, 50)",
          maskImage: `radial-gradient(
            120px circle at ${mousePos.x}px ${mousePos.y + 2}px,
            black,
            transparent
          )`,
          WebkitMaskImage: `radial-gradient(
            120px circle at ${mousePos.x}px ${mousePos.y + 2}px,
            black,
            transparent
          )`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          border: "2px solid rgb(50, 50, 255)",
          maskImage: `radial-gradient(
            120px circle at ${mousePos.x + 4}px ${mousePos.y - 1}px,
            black,
            transparent
          )`,
          WebkitMaskImage: `radial-gradient(
            120px circle at ${mousePos.x + 4}px ${mousePos.y - 1}px,
            black,
            transparent
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={index} className="text-gray-300">
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ThirdSection: React.FC = () => {

  return (
    <div className="min-h-screen p-8 my-8">
      <h2 className="text-center text-white text-5xl mb-3">Our Services</h2>
      <div className="text-center text-white mb-5">
        We provide the best digital solutions.
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default ThirdSection;
