// Brand + generic tech icons with official brand colors.
// Used by the Tech Stack section to render visually recognizable tile icons.
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiAngular,
  SiReact,
  SiVuedotjs,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiFirebase,
  SiMongodb,
  SiN8N,
  SiBitcoin,
  SiEthereum,
  SiOpenai,
  SiPostman,
} from "react-icons/si";
import {
  Layers,
  KeyRound,
  Cpu,
  HardDrive,
  Boxes,
  MessageSquareCode,
  Cable,
  Zap,
  Bug,
  TrendingUp,
  Webhook,
} from "lucide-react";

// Each entry: { Icon, color, type: "brand" | "generic" }
// color = brand color used for glow / highlight
export const techIcons = {
  // Languages
  html5:       { Icon: SiHtml5,       color: "#E34F26", type: "brand" },
  css3:        { Icon: SiCss,         color: "#2C8EBB", type: "brand" },
  javascript:  { Icon: SiJavascript,  color: "#F7DF1E", type: "brand" },
  typescript:  { Icon: SiTypescript,  color: "#3178C6", type: "brand" },
  python:      { Icon: SiPython,      color: "#3776AB", type: "brand" },

  // Frontend frameworks
  angular:     { Icon: SiAngular,     color: "#DD0031", type: "brand" },
  react:       { Icon: SiReact,       color: "#61DAFB", type: "brand" },
  vue:         { Icon: SiVuedotjs,    color: "#4FC08D", type: "brand" },
  tailwind:    { Icon: SiTailwindcss, color: "#06B6D4", type: "brand" },
  framer:      { Icon: SiFramer,      color: "#0055FF", type: "brand" },

  // Backend / infra
  nodejs:      { Icon: SiNodedotjs,   color: "#5FA04E", type: "brand" },
  postman:     { Icon: SiPostman,     color: "#FF6C37", type: "brand" },
  firebase:    { Icon: SiFirebase,    color: "#FFCA28", type: "brand" },
  mongodb:     { Icon: SiMongodb,     color: "#47A248", type: "brand" },
  n8n:         { Icon: SiN8N,         color: "#EA4B71", type: "brand" },
  openai:      { Icon: SiOpenai,      color: "#10A37F", type: "brand" },

  // Web3
  bitcoin:     { Icon: SiBitcoin,     color: "#F7931A", type: "brand" },
  ethereum:    { Icon: SiEthereum,    color: "#8A9EF5", type: "brand" },

  // Generic (lucide) — neutral accent color
  components:  { Icon: Layers,             color: "#7CC8FF", type: "generic" },
  auth:        { Icon: KeyRound,           color: "#A78BFA", type: "generic" },
  api:         { Icon: Webhook,            color: "#7CC8FF", type: "generic" },
  backend:     { Icon: Cpu,                color: "#7CC8FF", type: "generic" },
  fullstack:   { Icon: Layers,             color: "#60A5FA", type: "generic" },
  storage:     { Icon: HardDrive,          color: "#9AA4B6", type: "generic" },
  structures:  { Icon: Boxes,              color: "#A78BFA", type: "generic" },
  prompt:      { Icon: MessageSquareCode,  color: "#22D3EE", type: "generic" },
  integrations:{ Icon: Cable,              color: "#7CC8FF", type: "generic" },
  automation:  { Icon: Zap,                color: "#FCD34D", type: "generic" },
  bug:         { Icon: Bug,                color: "#22D3EE", type: "generic" },
  trading:     { Icon: TrendingUp,         color: "#10B981", type: "generic" },
};
