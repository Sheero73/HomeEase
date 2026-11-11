export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface NearbyProviderQuery {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  category?: string;
  minRating?: number;
  limit?: number;
  offset?: number;
}

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
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

export function calculateEtaMinutes(distanceKm: number): number {
  // Average urban speed ~ 22 km/h + 2 min dispatch & parking buffer
  return Math.max(3, Math.round((distanceKm / 22) * 60 + 2));
}

/**
 * Architectural SQL query reference for PostgreSQL + PostGIS:
 * 
 * SELECT id, name, rating, completed_jobs,
 *        ST_Distance(coords, ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography) / 1000 AS distance_km
 * FROM service_providers
 * WHERE is_online = true AND is_available = true
 *   AND ST_DWithin(coords, ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography, $radius_meters)
 *   AND $category = ANY(specialties)
 * ORDER BY distance_km ASC
 * LIMIT $limit OFFSET $offset;
 */
export const POSTGIS_SPATIAL_QUERY_REFERENCE = `
-- PostGIS Spatial Query for Enterprise Scalability:
SELECT p.id, p.name, p.rating, p.phone, p.vehicle_plate,
       ST_Distance(p.geom, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography) / 1000 AS distance_km
FROM providers p
WHERE p.is_online = true
  AND p.vacation_mode = false
  AND :category = ANY(p.specialties)
  AND ST_DWithin(p.geom, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radius_km * 1000)
ORDER BY distance_km ASC
LIMIT 20;
`;

/**
 * Architectural Redis GEO command reference:
 * 
 * GEOADD fleet:locations <lng> <lat> <provider_id>
 * GEOSEARCH fleet:locations FROMLONLAT <lng> <lat> BYRADIUS <radius_km> KM WITHDIST WITHCOORD ASC
 */
export const REDIS_GEO_REFERENCE = `
-- Redis GEO for 100,000+ Real-Time Driver/Technician Pings:
GEOADD fleet:locations 77.5982 12.9738 "pro-1"
GEOSEARCH fleet:locations FROMLONLAT 77.5946 12.9716 BYRADIUS 10 KM WITHDIST WITHCOORD ASC COUNT 20
`;
