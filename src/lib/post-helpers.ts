export const CATEGORIES = [
  { value: "orgu", label: "Örgü & Tığ", emoji: "🧶" },
  { value: "dikis", label: "Dikiş & Nakış", emoji: "🧵" },
  { value: "makrome", label: "Makrome", emoji: "🪢" },
  { value: "kanavice", label: "Kanaviçe", emoji: "🪡" },
  { value: "amigurumi", label: "Amigurumi", emoji: "🧸" },
  { value: "deri", label: "Deri", emoji: "👜" },
  { value: "ahsap", label: "Ahşap", emoji: "🪵" },
  { value: "boyama", label: "Boyama", emoji: "🎨" },
  { value: "diger", label: "Diğer", emoji: "✨" },
];

export function categoryLabel(value: string | null | undefined) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value ?? "";
}

export function categoryEmoji(value: string | null | undefined) {
  return CATEGORIES.find((c) => c.value === value)?.emoji ?? "✨";
}

export function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dk`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} sa`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} g`;
  return new Date(iso).toLocaleDateString("tr-TR");
}

export function parseHashtags(text: string): string[] {
  const matches = text.match(/#[\wçğıöşüÇĞİÖŞÜ]+/g) ?? [];
  return [...new Set(matches.map((h) => h.slice(1).toLowerCase()))];
}