// Pricing rules. The published rule is "$125 per person within 20 miles of
// Middletown, NY". The travel-fee and tax rules below are the ones the site
// already charged at checkout; the owner should confirm them (see README notes).
export const PRICING = {
  currency: "usd",
  basePerPersonCents: 12500,
  includedRadiusMiles: 20,
  // Beyond the included radius: $10 per started 10 miles of total distance.
  travelFeePerBlockCents: 1000,
  travelBlockMiles: 10,
  taxRate: 0.04,
  maxOnlinePeople: 10,
} as const;

// Middletown, NY (10940)
export const ORIGIN = { lat: 41.4459, lng: -74.4229 };

export function distanceInMiles(lat: number, lng: number) {
  const R = 3958.8;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat - ORIGIN.lat);
  const dLng = toRad(lng - ORIGIN.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(ORIGIN.lat)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type PriceQuote = {
  people: number;
  distanceMiles: number;
  baseCents: number;
  travelFeeCents: number;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
};

/** Computes the payable total from trusted inputs. Never accept an amount from the browser. */
export function calculatePrice({ people, distanceMiles }: { people: number; distanceMiles: number }): PriceQuote {
  if (!Number.isInteger(people) || people < 1 || people > PRICING.maxOnlinePeople) {
    throw new RangeError(`people must be an integer between 1 and ${PRICING.maxOnlinePeople}`);
  }
  if (!Number.isFinite(distanceMiles) || distanceMiles < 0) {
    throw new RangeError("distanceMiles must be a non-negative number");
  }

  const roundedMiles = Math.round(distanceMiles * 10) / 10;
  const baseCents = PRICING.basePerPersonCents * people;
  const travelFeeCents =
    roundedMiles <= PRICING.includedRadiusMiles
      ? 0
      : Math.ceil(roundedMiles / PRICING.travelBlockMiles) * PRICING.travelFeePerBlockCents;
  const subtotalCents = baseCents + travelFeeCents;
  const taxCents = Math.round(subtotalCents * PRICING.taxRate);

  return {
    people,
    distanceMiles: roundedMiles,
    baseCents,
    travelFeeCents,
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
    currency: PRICING.currency,
  };
}

export function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
