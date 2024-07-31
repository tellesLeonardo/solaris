const DicProductStrip = {
  plans: ["F", "P", "D"],
  F: "price_1PiWuXRuDuHPl5ylsH7ydA2P",
  P: "price_1PiWvwRuDuHPl5ylX6QUVtcR",
  D: "price_1PiWwsRuDuHPl5ylhmhq1uoK",
};

function getCodePlan(plan: string) {
  switch (plan) {
    case "F": // Free plan
      return DicProductStrip.F;
    case "P": // Pro plan
      return DicProductStrip.P;
    case "D": // Deluxe plan
      return DicProductStrip.D;
    default:
      return DicProductStrip.F;
  }
}

export { DicProductStrip, getCodePlan };
