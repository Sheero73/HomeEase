import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'homeease-super-secret-jwt-key-2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'homeease-refresh-secret-2026',
    accessExpiry: '1h',
    refreshExpiry: '30d',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/homeease',
    poolMin: 2,
    poolMax: 20,
    spatialIndex: 'GIST(coords)',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    geoKey: 'fleet:locations',
  },
  matching: {
    defaultRadiusKm: 10,
    maxRadiusKm: 25,
    dispatchTimeoutSeconds: 15,
    maxCandidatesPerBatch: 5,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-3.8-flash',
  },
};
