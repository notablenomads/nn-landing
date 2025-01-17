import {
    SiAmazon,
    SiAndroid,
    SiAngular,
    SiBabel,
    SiCss3,
    SiDjango,
    SiDocker,
    SiFirebase,
    SiGit,
    SiGraphql,
    SiHtml5,
    SiJavascript,
    SiJenkins,
    SiKubernetes,
    SiLaravel,
    SiLinux,
    SiMongodb,
    SiMysql,
    SiNextdotjs,
    SiNginx,
    SiNodedotjs,
    SiPython,
    SiReact,
    SiRedis,
    SiSass,
    SiSpring,
    SiTailwindcss,
    SiTypescript,
    SiVuedotjs,
    SiWebpack
} from "react-icons/si";
import {IconType} from "react-icons";

export interface IconData {
    Icon: IconType;
    color: string;
    name: string;
}

const allIcons: IconData[] = [
    {Icon: SiReact, color: "#61DAFB", name: "React"},
    {Icon: SiJavascript, color: "#F7DF1E", name: "JavaScript"},
    {Icon: SiTypescript, color: "#3178C6", name: "TypeScript"},
    {Icon: SiCss3, color: "#1572B6", name: "CSS"},
    {Icon: SiHtml5, color: "#E34F26", name: "HTML"},
    {Icon: SiVuedotjs, color: "#4FC08D", name: "Vue"},
    {Icon: SiNextdotjs, color: "#000000", name: "Next.js"},
    {Icon: SiWebpack, color: "#8DD6F9", name: "Webpack"},
    {Icon: SiNodedotjs, color: "#339933", name: "Node.js"},
    {Icon: SiMongodb, color: "#47A248", name: "MongoDB"},
    {Icon: SiMysql, color: "#4479A1", name: "MySQL"},
    {Icon: SiGraphql, color: "#E10098", name: "GraphQL"},
    {Icon: SiPython, color: "#3776AB", name: "Python"},
    {Icon: SiDocker, color: "#2496ED", name: "Docker"},
    {Icon: SiAmazon, color: "#FF9900", name: "AWS"},
    {Icon: SiGit, color: "#F05032", name: "Git"},
    {Icon: SiKubernetes, color: "#326CE5", name: "Kubernetes"},
    {Icon: SiLinux, color: "#FCC624", name: "Linux"},
    {Icon: SiTailwindcss, color: "#06B6D4", name: "Tailwind"},
    {Icon: SiSass, color: "#CC6699", name: "Sass"},
    {Icon: SiAngular, color: "#DD0031", name: "Angular"},
    {Icon: SiDjango, color: "#092E20", name: "Django"},
    {Icon: SiLaravel, color: "#FF2D20", name: "Laravel"},
    {Icon: SiSpring, color: "#6DB33F", name: "Spring"},
    {Icon: SiJenkins, color: "#D24939", name: "Jenkins"},
    {Icon: SiNginx, color: "#009639", name: "Nginx"},
    {Icon: SiRedis, color: "#DC382D", name: "Redis"},
    {Icon: SiAndroid, color: "#3DDC84", name: "Android"},
    {Icon: SiBabel, color: "#F9DC3E", name: "Babel"},
    {Icon: SiFirebase, color: "#FFCA28", name: "Firebase"},
];


export default allIcons;