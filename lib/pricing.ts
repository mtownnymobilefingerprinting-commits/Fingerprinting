// Middletown, NY (10940) Coordinates
const MIDDLETOWN_LAT = 41.4459;
const MIDDLETOWN_LNG = -74.4229;

function getDistanceFromLatLonInMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Radius of the earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
}

export function calculateTotalPrice({
  basePrice = 125,
  destLat,
  destLng,
}: {
  basePrice?: number;
  destLat?: number;
  destLng?: number;
}) {
  let travelFee = 0;
  let distanceInMiles = 0;

  if (destLat && destLng) {
    distanceInMiles = getDistanceFromLatLonInMiles(
      MIDDLETOWN_LAT,
      MIDDLETOWN_LNG,
      destLat,
      destLng
    );

    // $10 for every 10 miles (rounded up to nearest 10 miles)
    const tenMileBlocks = Math.ceil(distanceInMiles / 10);
    travelFee = tenMileBlocks * 10;
  }

  const subtotal = basePrice + travelFee;
  const tax = subtotal * 0.04; // 4% tax
  const total = subtotal + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    travelFee,
    distanceInMiles: Math.round(distanceInMiles * 10) / 10,
    total: Math.round(total * 100) / 100,
    totalInCents: Math.round(total * 100), // Stripe requires cents
  };
}