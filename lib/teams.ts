import type { KitColors } from "./products";

export type TeamGroup = "country" | "club";

export type Team = {
  id: string;
  /** Full name, used in descriptions */
  name: string;
  /** Short name used in product titles, e.g. "PSG" */
  short: string;
  group: TeamGroup;
  kit: KitColors;
  /** Shown in the /custom kit builder */
  builder?: boolean;
};

// Home-kit colourways only — no crests or sponsor marks are drawn.
export const TEAMS: Team[] = [
  // Countries
  { id: "brazil", name: "Brazil", short: "Brazil", group: "country", builder: true, kit: { base: "#f2c230", accent: "#0f7a3d", trim: "#0f7a3d", pattern: "solid" } },
  { id: "portugal", name: "Portugal", short: "Portugal", group: "country", builder: true, kit: { base: "#c8102e", accent: "#0f5132", trim: "#0f7a3d", pattern: "solid" } },
  { id: "argentina", name: "Argentina", short: "Argentina", group: "country", builder: true, kit: { base: "#f4f7f6", accent: "#6cb4ee", trim: "#14213d", pattern: "stripes" } },
  { id: "france", name: "France", short: "France", group: "country", builder: true, kit: { base: "#1a2a5c", accent: "#1a2a5c", trim: "#f4f7f6", pattern: "solid" } },
  { id: "spain", name: "Spain", short: "Spain", group: "country", builder: true, kit: { base: "#c8102e", accent: "#f2c230", trim: "#f2c230", pattern: "solid" } },
  { id: "england", name: "England", short: "England", group: "country", kit: { base: "#f4f7f6", accent: "#f4f7f6", trim: "#14213d", pattern: "solid" } },

  // Clubs
  { id: "real-madrid", name: "Real Madrid", short: "Real Madrid", group: "club", builder: true, kit: { base: "#f4f7f6", accent: "#f4f7f6", trim: "#b8912f", pattern: "solid" } },
  { id: "barcelona", name: "FC Barcelona", short: "Barcelona", group: "club", builder: true, kit: { base: "#004d98", accent: "#a50044", trim: "#edbb00", pattern: "stripes" } },
  { id: "man-city", name: "Manchester City", short: "Man City", group: "club", builder: true, kit: { base: "#6cabdd", accent: "#6cabdd", trim: "#f4f7f6", pattern: "solid" } },
  { id: "psg", name: "Paris Saint-Germain", short: "PSG", group: "club", builder: true, kit: { base: "#0b1b3f", accent: "#da291c", trim: "#f4f7f6", pattern: "band" } },
  { id: "man-united", name: "Manchester United", short: "Man United", group: "club", builder: true, kit: { base: "#da291c", accent: "#da291c", trim: "#f4f7f6", pattern: "solid" } },
  { id: "santos", name: "Santos FC", short: "Santos", group: "club", kit: { base: "#f4f7f6", accent: "#f4f7f6", trim: "#111418", pattern: "solid" } },
  { id: "al-hilal", name: "Al Hilal", short: "Al Hilal", group: "club", kit: { base: "#0b4ea2", accent: "#0b4ea2", trim: "#f4f7f6", pattern: "solid" } },
  { id: "sporting", name: "Sporting CP", short: "Sporting", group: "club", kit: { base: "#f4f7f6", accent: "#00804a", trim: "#00804a", pattern: "hoops" } },
  { id: "juventus", name: "Juventus", short: "Juventus", group: "club", kit: { base: "#f4f7f6", accent: "#111418", trim: "#111418", pattern: "stripes" } },
  { id: "al-nassr", name: "Al Nassr", short: "Al Nassr", group: "club", kit: { base: "#fcd116", accent: "#fcd116", trim: "#1d3f8f", pattern: "solid" } },
  { id: "inter-miami", name: "Inter Miami CF", short: "Inter Miami", group: "club", kit: { base: "#f7b5cd", accent: "#f7b5cd", trim: "#111418", pattern: "solid" } },
  { id: "monaco", name: "AS Monaco", short: "Monaco", group: "club", kit: { base: "#f4f7f6", accent: "#d9202f", trim: "#d9202f", pattern: "split" } },
  { id: "birmingham", name: "Birmingham City", short: "Birmingham", group: "club", kit: { base: "#1d3f8f", accent: "#1d3f8f", trim: "#f4f7f6", pattern: "solid" } },
  { id: "dortmund", name: "Borussia Dortmund", short: "Dortmund", group: "club", kit: { base: "#fde100", accent: "#fde100", trim: "#111418", pattern: "solid" } },
  { id: "flamengo", name: "Flamengo", short: "Flamengo", group: "club", kit: { base: "#c8102e", accent: "#111418", trim: "#f4f7f6", pattern: "hoops" } },
];

export function getTeam(id: string) {
  return TEAMS.find((t) => t.id === id);
}

/** Teams offered in the kit builder */
export function teamsIn(group: TeamGroup) {
  return TEAMS.filter((t) => t.group === group && t.builder);
}
