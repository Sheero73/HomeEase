import { LocationCoords, ServiceProvider } from '../types';

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function estimateEtaMinutes(distanceKm: number): number {
  return Math.max(3, Math.round((distanceKm / 22) * 60 + 2));
}

export interface MatchedProviderResult {
  provider: ServiceProvider;
  distanceKm: number;
  etaMinutes: number;
  matchScore: number;
}

export function matchNearbyProviders(
  customerLocation: LocationCoords,
  providers: ServiceProvider[],
  serviceCategoryId: string,
  maxRadiusKm: number = 10
): MatchedProviderResult[] {
  const matched: MatchedProviderResult[] = [];

  for (const provider of providers) {
    if (!provider.isOnline || provider.vacationMode) continue;
    if (serviceCategoryId && !provider.specialties.includes(serviceCategoryId)) continue;

    const distanceKm = calculateDistanceKm(
      customerLocation.lat,
      customerLocation.lng,
      provider.coords.lat,
      provider.coords.lng
    );

    if (distanceKm <= maxRadiusKm) {
      const etaMinutes = estimateEtaMinutes(distanceKm);
      const matchScore =
        provider.rating * 7 +
        (provider.completionRate / 100) * 20 -
        distanceKm * 4 +
        Math.max(0, 10 - provider.responseTimeMinutes);

      matched.push({
        provider,
        distanceKm,
        etaMinutes,
        matchScore: Math.round(matchScore * 10) / 10,
      });
    }
  }

  return matched.sort((a, b) => b.matchScore - a.matchScore);
}
