export const normalizeCategoryLabel = (title) => {
  const value = String(title || "").toLowerCase();
  if (!value || value === "null") return null;
  if (value.includes("electronic")) return null;
  if (value.includes("women")) return "Women";
  if (value.includes("men")) return "Men";
  if (value.includes("jewel") || value.includes("accessor")) return "Accessories";
  return null;
};

export const buildStoreCategories = (rawCategories) => {
  if (!Array.isArray(rawCategories)) return [];

  const seen = new Set();
  const mapped = [];

  for (const category of rawCategories) {
    const title = category?.attributes?.title ?? category?.title;
    const label = normalizeCategoryLabel(title);
    if (!label || seen.has(label)) continue;
    seen.add(label);
    mapped.push({ id: category.id, title: label });
  }

  return mapped;
};
