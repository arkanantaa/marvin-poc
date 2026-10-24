export type Portrait = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};
export type Collection = {
  id: string;
  name: string;
  caption: string;
  description: string;
  images: readonly Portrait[];
};

const portraits: Portrait[] = [
  "Two friends posing together",
  "Friends smiling for a booth portrait",
  "A black and white portrait of two friends",
  "A group celebrating together",
  "Friends leaning in for a group portrait",
  "A group making memories in the booth",
].map((alt, index) => ({
  id: `portrait-${index + 1}`,
  src: `portfolio/portrait-${index + 1}.webp`,
  alt,
  width: 300,
  height: 360,
}));

export const collections: readonly Collection[] = [
  {
    id: "classics",
    name: "The classics",
    caption: "A few seconds.\nA forever kind of feeling.",
    description: "Unfiltered smiles and the in-between faces. A little reminder of being yourself.",
    images: portraits.slice(0, 3),
  },
  {
    id: "warm-memories",
    name: "Warm memories",
    caption: "Good company.\nBetter memories.",
    description: "The people who make an ordinary moment feel like something worth keeping.",
    images: portraits.slice(3, 6),
  },
  {
    id: "after-hours",
    name: "After hours",
    caption: "One more moment\nbefore you go.",
    description: "For the last laugh, the unexpected pose, and the stories that stay with you.",
    images: [portraits[1], portraits[3], portraits[5]],
  },
];
export const tabs = [
  { id: "portraits", label: "The portraits" },
  { id: "experience", label: "The experience" },
  { id: "hello", label: "Say hello" },
] as const;
export type PortfolioTab = (typeof tabs)[number]["id"];
export const experience = {
  heading: "Close the curtain.\nOpen up a little.",
  description: "A concept for a small, private space where the best photo is the one that feels like you.",
  steps: [
    { title: "Step inside", description: "Your people. A little privacy. A moment of your own." },
    { title: "Find your face", description: "The big smile, the silly one, the perfectly imperfect one." },
    { title: "Keep a moment", description: "A small reminder of a very good time." },
  ],
};
export type ContactAction = {
  label: string;
  href: `mailto:${string}` | `https://${string}`;
};
export const contact: {
  heading: string;
  description: string;
  note: string;
  action: ContactAction | null;
} = {
  heading: "Your people.\nOur little booth.",
  description: "A wedding, a celebration, or just because. Imagine Marvin in your next memory.",
  note: "This is a concept preview. Contact and bookings are not connected yet.",
  // Add only a confirmed business destination.
  action: null,
};
export const portfolioLabels = {
  tagline: "A LITTLE SPACE FOR YOU",
  contentNotice: "REFERENCE PORTRAITS · DEMO CONTENT",
  printSignature: "marvin studio",
};
