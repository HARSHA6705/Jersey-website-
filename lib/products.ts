import { getTeam, type TeamGroup } from "./teams";

export type Pattern = "solid" | "stripes" | "hoops" | "sash" | "split" | "band";

export type KitColors = {
  base: string;
  accent: string;
  trim: string;
  pattern: Pattern;
};

export type PlayerId = "njr" | "cr7" | "messi" | "mbappe" | "bellingham" | "vini-jr";

export type Player = {
  id: PlayerId;
  name: string;
  /** Filter-chip label */
  chip: string;
  /** Used in product titles: "PSG Neymar" */
  title: string;
  /** Default print on the back of the shirt */
  printName: string;
};

export const PLAYERS: Player[] = [
  { id: "njr", name: "Neymar Jr", chip: "NJR", title: "Neymar", printName: "NEYMAR JR" },
  { id: "cr7", name: "Cristiano Ronaldo", chip: "CR7", title: "Ronaldo", printName: "RONALDO" },
  { id: "messi", name: "Lionel Messi", chip: "Messi", title: "Messi", printName: "MESSI" },
  { id: "mbappe", name: "Kylian Mbappé", chip: "Mbappé", title: "Mbappé", printName: "MBAPPE" },
  { id: "bellingham", name: "Jude Bellingham", chip: "Bellingham", title: "Bellingham", printName: "BELLINGHAM" },
  { id: "vini-jr", name: "Vinícius Jr", chip: "Vini Jr", title: "Vini Jr", printName: "VINI JR." },
];

export type Product = {
  slug: string;
  name: string;
  price: number;
  tagline: string;
  description: string;
  kit: KitColors;
  fabric: string;
  fit: string;
  features: string[];
  player?: PlayerId;
  teamId?: string;
  teamGroup?: TeamGroup;
  /** A kit from a club the player has since left */
  retro?: boolean;
  /** Real product photos; jerseys without them use the drawn JerseyArt */
  photos?: ProductPhotos;
  /** Player name & number pressed on by default — included in the price */
  print?: { name: string; number: string };
  /** Hidden products are buyable (e.g. via the customizer) but not listed in the shop */
  hidden?: boolean;
};

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export const PRINT_PRICE = 499;
export const PLAYER_KIT_PRICE = 2499;
export const SHIPPING_FEE = 99;
export const FREE_SHIPPING_THRESHOLD = 2999;
export const NAME_MAX = 12;

export type ProductPhotos = { front: string; back: string };

// Jerseys with real photos — transparent cut-out PNGs in /public/images/products named
// <slug>-front.png and <slug>-back.png. Add a slug here once both files are in place.
const PHOTO_SLUGS = [
  "santos-njr",
  "barcelona-njr",
  "psg-njr",
  "al-hilal-njr",
  "brazil-njr",
  "sporting-cr7",
  "man-united-cr7",
  "real-madrid-cr7",
  "juventus-cr7",
  "al-nassr-cr7",
  "portugal-cr7",
  "barcelona-messi",
  "psg-messi",
  "inter-miami-messi",
  "argentina-messi",
  "france-mbappe",
  "england-bellingham",
];

const PHOTOS: Record<string, ProductPhotos> = Object.fromEntries(
  PHOTO_SLUGS.map((slug) => [
    slug,
    { front: `/images/products/${slug}-front.png`, back: `/images/products/${slug}-back.png` },
  ])
);

// Every club and national team each player has represented, with their shirt number there.
// "retro" marks clubs the player has since left.
const CAREERS: [PlayerId, string, string, "retro"?][] = [
  ["njr", "santos", "10"],
  ["njr", "barcelona", "11", "retro"],
  ["njr", "psg", "10", "retro"],
  ["njr", "al-hilal", "10", "retro"],
  ["njr", "brazil", "10"],

  ["cr7", "sporting", "28", "retro"],
  ["cr7", "man-united", "7", "retro"],
  ["cr7", "real-madrid", "7", "retro"],
  ["cr7", "juventus", "7", "retro"],
  ["cr7", "al-nassr", "7"],
  ["cr7", "portugal", "7"],

  ["messi", "barcelona", "10", "retro"],
  ["messi", "psg", "30", "retro"],
  ["messi", "inter-miami", "10"],
  ["messi", "argentina", "10"],

  ["mbappe", "monaco", "10", "retro"],
  ["mbappe", "psg", "7", "retro"],
  ["mbappe", "real-madrid", "10"],
  ["mbappe", "france", "10"],

  ["bellingham", "birmingham", "22", "retro"],
  ["bellingham", "dortmund", "22", "retro"],
  ["bellingham", "real-madrid", "5"],
  ["bellingham", "england", "10"],

  ["vini-jr", "flamengo", "20", "retro"],
  ["vini-jr", "real-madrid", "7"],
  ["vini-jr", "brazil", "7"],
];

const PLAYER_KITS: Product[] = CAREERS.map(([playerId, teamId, number, era]) => {
  const player = PLAYERS.find((p) => p.id === playerId)!;
  const team = getTeam(teamId)!;
  return {
    slug: `${teamId}-${playerId}`,
    name: `${team.short} ${player.title}`,
    price: PLAYER_KIT_PRICE,
    tagline: `${team.name} home shirt, pressed with ${player.printName} ${number}.`,
    description: `The ${team.name} home colourway in our pro-fit cut, with ${player.name}'s name and number ${number} pressed on the back. Want your own name instead? Change the print below at no extra cost.`,
    kit: team.kit,
    fabric: "Pro-Fit Aero Mesh · 100% recycled polyester",
    fit: "Athletic / slim — size up for a relaxed fit",
    features: [
      `${player.printName} ${number} included in the price`,
      "Laser-cut ventilation zones under the arms",
      "Moisture-wicking, quick-dry finish",
      "Pressed in our Oslo studio, ships in 5 days",
    ],
    player: playerId,
    teamId,
    teamGroup: team.group,
    retro: era === "retro",
    photos: PHOTOS[`${teamId}-${playerId}`],
    print: { name: player.printName, number },
  };
});

export const CUSTOM_SLUG = "custom-kit";

export const PRODUCTS: Product[] = [
  ...PLAYER_KITS,
  {
    slug: CUSTOM_SLUG,
    name: "Custom Kit",
    price: 2799,
    tagline: "Your country or club, your name, your number.",
    description: "A pro-fit jersey in your team's colours, built in the kit builder.",
    kit: { base: "#f2c230", accent: "#0f7a3d", trim: "#0f7a3d", pattern: "solid" },
    fabric: "Pro-Fit Aero Mesh · 100% recycled polyester",
    fit: "Athletic / slim",
    features: ["Fully sublimated design", "Any colour combination", "Ships in 7 days"],
    hidden: true,
  },
];

export function listedProducts() {
  return PRODUCTS.filter((p) => !p.hidden);
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function playerKits(id: PlayerId) {
  return listedProducts().filter((p) => p.player === id);
}

export function getPlayer(id: string | undefined) {
  return PLAYERS.find((p) => p.id === id);
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(amount: number) {
  return currency.format(amount);
}
