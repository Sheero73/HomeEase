import { calculateDistanceKm, calculateEtaMinutes } from './geoDiscoveryService';

export interface ProviderCandidate {
  id: string;
  name: string;
  rating: number;
  completedJobs: number;
  completionRate: number;
  responseTimeMinutes: number;
  coords: { lat: number; lng: number; address: string };
  specialties: string[];
  isOnline: boolean;
  vacationMode: boolean;
  vehiclePlate: string;
}

export interface ScoredCandidate {
  provider: ProviderCandidate;
  distanceKm: number;
  etaMinutes: number;
  matchScore: number;
}

export class MatchingEngine {
  /**
   * Evaluates candidate providers against request criteria and returns sorted candidates by match score
   */
  public static rankCandidates(
    customerCoords: { lat: number; lng: number },
    category: string,
    candidates: ProviderCandidate[],
    maxRadiusKm: number = 10
  ): ScoredCandidate[] {
    const scored: ScoredCandidate[] = [];

    for (const pro of candidates) {
      if (!pro.isOnline || pro.vacationMode) continue;
      if (category && !pro.specialties.includes(category)) continue;

      const dist = calculateDistanceKm(
        customerCoords.lat,
        customerCoords.lng,
        pro.coords.lat,
        pro.coords.lng
      );

      if (dist <= maxRadiusKm) {
        const eta = calculateEtaMinutes(dist);
        // Multi-factor Uber/Rapido weighting score:
        // Proximity (higher distance reduces score by 4 pts/km)
        // Reputation (star rating multiplied by 15)
        // Reliability (completion rate percentage scaled to 20 pts)
        // Responsiveness (fast responder bonus up to 10 pts)
        const score =
          pro.rating * 15 +
          (pro.completionRate / 100) * 20 -
          dist * 4 +
          Math.max(0, 10 - pro.responseTimeMinutes);

        scored.push({
          provider: pro,
          distanceKm: dist,
          etaMinutes: eta,
          matchScore: Math.round(score * 10) / 10,
        });
      }
    }

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  }
}
