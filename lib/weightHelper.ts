export function parseWeightGrams(weightStr: string): number {
  if (!weightStr) return 0;
  const w = weightStr.trim().toLowerCase();

  if (w.includes("on demand")) return 0;

  // e.g. "4 paya" -> special case
  if (w.includes("paya")) return 800;

  // e.g. "1.5 kg", "1 kg", "2 kg", "Medium size (1 kg)", "Large size (1 kg)"
  const kgMatch = w.match(/([\d.]+)\s*kg/i);
  if (kgMatch) {
    return Math.round(parseFloat(kgMatch[1]) * 1000);
  }

  // e.g. "500 g", "750 g", "250 g"
  const gMatch = w.match(/([\d.]+)\s*g\b/i);
  if (gMatch) {
    return Math.round(parseFloat(gMatch[1]));
  }

  return 0;
}

export function getBaseWeightLabel(weightStr: string): string {
  if (!weightStr) return "";
  return weightStr.replace(/\s*\((?:min(?:imum)?\s*order|half\s*kg)[^)]*\)/gi, "").trim();
}

// Helper function to calculate dynamically displayed weight based on quantity and category
export function formatItemWeight(weightStr: string, qty: number, category: string): string {
  if (!weightStr) return `${qty}`;
  const w = weightStr.trim();

  // If on demand
  if (w.toLowerCase().includes("on demand")) {
    return "On Demand";
  }

  // If paya
  if (w.toLowerCase().includes("paya")) {
    return qty > 1 ? `${qty * 4} Paya` : "4 Paya";
  }

  // Parse exact weight numbers like "1 kg", "Medium size (1 kg)", "500 g", "1.5 kg"
  const kgMatch = w.match(/([\d.]+)\s*kg/i);
  if (kgMatch) {
    const unitKg = parseFloat(kgMatch[1]);
    const totalKg = unitKg * qty;
    const prefix = w.replace(/\(?[\d.]+\s*kg\)?/gi, "").trim();
    const displayKg = `${Number(totalKg.toFixed(2))} kg`;
    return prefix ? `${prefix} (${displayKg})` : displayKg;
  }

  const gMatch = w.match(/([\d.]+)\s*g\b/i);
  if (gMatch) {
    const unitG = parseFloat(gMatch[1]);
    const totalG = unitG * qty;
    return totalG >= 1000 ? `${Number((totalG / 1000).toFixed(2))} kg` : `${totalG} g`;
  }

  return qty > 1 ? `${qty} x ${w}` : w;
}

export interface MinWeightViolation {
  name: string;
  category: string;
  currentGrams: number;
  currentDisplay: string;
  minGrams: number;
  minDisplay: string;
}

// Check if any product violates the minimum weight policy:
// Chicken: Min 1 kg (1000 g)
// Fish & Seafood: Min 1 kg (1000 g) - except On Demand
// Mutton: Min half kg (500 g)
export function checkCartMinWeightViolations(cart: Array<{
  name: string;
  category: string;
  weight: string;
  quantity: number;
}>): MinWeightViolation[] {
  const violations: MinWeightViolation[] = [];

  // Group by item name to evaluate the total weight user is buying of that product
  const productTotals: Record<string, { category: string; totalGrams: number; hasOnDemand: boolean }> = {};

  cart.forEach((item) => {
    const gramsPerPack = parseWeightGrams(item.weight);
    const isDemand = (item.weight || "").toLowerCase().includes("on demand");

    if (!productTotals[item.name]) {
      productTotals[item.name] = { category: item.category, totalGrams: 0, hasOnDemand: false };
    }
    productTotals[item.name].totalGrams += gramsPerPack * (item.quantity || 1);
    if (isDemand) {
      productTotals[item.name].hasOnDemand = true;
    }
  });

  Object.entries(productTotals).forEach(([name, data]) => {
    if (data.hasOnDemand) return; // exempt on-demand items
    const cat = data.category.toLowerCase();

    let minGrams = 0;
    let minDisplay = "";

    if (cat.includes("chicken")) {
      minGrams = 1000;
      minDisplay = "1 kg";
    } else if (cat.includes("fish") || cat.includes("seafood")) {
      minGrams = 1000;
      minDisplay = "1 kg";
    } else if (cat.includes("mutton")) {
      minGrams = 500;
      minDisplay = "500 g (Half kg)";
    }

    if (minGrams > 0 && data.totalGrams < minGrams) {
      const currentDisplay = data.totalGrams >= 1000
        ? `${Number((data.totalGrams / 1000).toFixed(2))} kg`
        : `${data.totalGrams} g`;

      violations.push({
        name,
        category: data.category,
        currentGrams: data.totalGrams,
        currentDisplay,
        minGrams,
        minDisplay,
      });
    }
  });

  return violations;
}
