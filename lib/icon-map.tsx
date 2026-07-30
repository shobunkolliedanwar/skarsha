import {
  Sparkles,
  GraduationCap,
  Music,
  Clapperboard,
  Link as LinkIcon,
  Newspaper,
  ShoppingBag,
  Gamepad2,
  BookOpen,
  Briefcase,
  Camera,
  Heart,
  Globe,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  "graduation-cap": GraduationCap,
  music: Music,
  clapperboard: Clapperboard,
  link: LinkIcon,
  newspaper: Newspaper,
  "shopping-bag": ShoppingBag,
  gamepad: Gamepad2,
  book: BookOpen,
  briefcase: Briefcase,
  camera: Camera,
  heart: Heart,
  globe: Globe,
};

export const ICON_NAMES = Object.keys(ICONS);

export function resolveIcon(name?: string | null): LucideIcon {
  if (!name) return Sparkles;
  return ICONS[name] ?? Sparkles;
}
