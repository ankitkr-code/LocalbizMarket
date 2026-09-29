export const HEALTH_BADGE_STYLES = {
  "Strong proof": "bg-emerald-50 text-emerald-700",
  "Growing signal": "bg-sky-50 text-sky-700",
  "Needs review": "bg-orange-50 text-orange-700",
  "Weak proof": "bg-red-50 text-red-700",
  "Needs claim": "bg-amber-50 text-amber-700"
};

export function getHealthBadgeClass(badge) {
  return HEALTH_BADGE_STYLES[badge] || HEALTH_BADGE_STYLES["Needs claim"];
}
