// Every product category is assigned a stable accent color from a fixed
// rotation, hashed from the category name. This is what gives AeroCart its
// "each category has an identity" signature — the same category always
// lands on the same color across cards, badges, filters and the command
// palette, without needing a hand-maintained color map.

const PALETTE = [
  { name: "violet", value: "var(--color-cat-violet)" },
  { name: "cyan", value: "var(--color-cat-cyan)" },
  { name: "amber", value: "var(--color-cat-amber)" },
  { name: "rose", value: "var(--color-cat-rose)" },
  { name: "emerald", value: "var(--color-cat-emerald)" },
  { name: "sky", value: "var(--color-cat-sky)" },
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function categoryColor(category) {
  if (!category) return PALETTE[0];
  const index = hashString(category.toLowerCase()) % PALETTE.length;
  return PALETTE[index];
}
