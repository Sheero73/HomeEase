import { Router, Request, Response } from 'express';
import { authenticateToken, requireRoles } from '../middleware/auth';
import { MatchingEngine, ProviderCandidate } from '../services/matchingEngine';

const router = Router();

// In-memory persistent fleet store
export const FLEET_STORE: ProviderCandidate[] = [
  {
    id: 'pro-1',
    name: 'Rajesh Kumar',
    rating: 4.94,
    completedJobs: 1420,
    completionRate: 99.2,
    responseTimeMinutes: 3,
    coords: { lat: 12.9738, lng: 77.5982, address: '100ft Road, HAL 2nd Stage, Indiranagar' },
    specialties: ['electrician', 'appliance-repair', 'inverter-service'],
    isOnline: true,
    vacationMode: false,
    vehiclePlate: 'KA 03 HM 4821',
  },
  {
    id: 'pro-2',
    name: 'Suresh Patil',
    rating: 4.91,
    completedJobs: 980,
    completionRate: 98.4,
    responseTimeMinutes: 4,
    coords: { lat: 12.9692, lng: 77.5921, address: '12th Main, Defense Colony, Indiranagar' },
    specialties: ['plumbing', 'water-tank-cleaning'],
    isOnline: true,
    vacationMode: false,
    vehiclePlate: 'KA 04 EL 1198',
  },
  {
    id: 'pro-3',
    name: 'Vikram Mehta',
    rating: 4.96,
    completedJobs: 1890,
    completionRate: 99.8,
    responseTimeMinutes: 2,
    coords: { lat: 12.9751, lng: 77.5912, address: 'Cambridge Layout, Ulsoor' },
    specialties: ['ac-service', 'ac-repair', 'refrigerator-repair'],
    isOnline: true,
    vacationMode: false,
    vehiclePlate: 'KA 01 MG 9032',
  },
  {
    id: 'pro-4',
    name: 'Pooja Sharma',
    rating: 4.95,
    completedJobs: 1350,
    completionRate: 99.1,
    responseTimeMinutes: 5,
    coords: { lat: 12.9664, lng: 77.5991, address: 'Domlur 2nd Stage, Near EGL' },
    specialties: ['home-cleaning', 'kitchen-cleaning', 'deep-cleaning', 'sofa-cleaning'],
    isOnline: true,
    vacationMode: false,
    vehiclePlate: 'KA 05 BK 6410',
  },
  {
    id: 'pro-5',
    name: 'Mohammad Imran',
    rating: 4.89,
    completedJobs: 820,
    completionRate: 97.6,
    responseTimeMinutes: 4,
    coords: { lat: 12.9782, lng: 77.596, address: 'Old Airport Road, Kodihalli' },
    specialties: ['washing-machine-repair', 'refrigerator-repair', 'appliance-repair'],
    isOnline: true,
    vacationMode: false,
    vehiclePlate: 'KA 03 JJ 7721',
  },
];

/**
 * @route   GET /api/v1/providers/nearby
 * @desc    Find and rank nearby online providers based on GPS coordinates and specialty
 * @access  Public
 */
router.get('/nearby', (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string) || 12.9716;
  const lng = parseFloat(req.query.lng as string) || 77.5946;
  const radiusKm = parseFloat(req.query.radius as string) || 10;
  const category = (req.query.category as string) || '';

  const ranked = MatchingEngine.rankCandidates(
    { lat, lng },
    category,
    FLEET_STORE,
    radiusKm
  );

  return res.json({
    success: true,
    query: {
      location: { lat, lng },
      radiusKm,
      category: category || 'all',
    },
    count: ranked.length,
    providers: ranked,
  });
});

/**
 * @route   GET /api/v1/providers/:id
 * @desc    Retrieve individual provider profile
 */
router.get('/:id', (req: Request, res: Response) => {
  const provider = FLEET_STORE.find((p) => p.id === req.params.id);
  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }

  return res.json({ success: true, provider });
});

/**
 * @route   PATCH /api/v1/providers/:id/location
 * @desc    Technician device pushes periodic GPS coordinate updates
 * @access  Private (Provider only)
 */
router.patch('/:id/location', authenticateToken, (req: Request, res: Response) => {
  const { lat, lng, address } = req.body;
  const proIndex = FLEET_STORE.findIndex((p) => p.id === req.params.id);

  if (proIndex === -1) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ success: false, message: 'lat and lng numbers required.' });
  }

  FLEET_STORE[proIndex].coords = {
    lat,
    lng,
    address: address || FLEET_STORE[proIndex].coords.address,
  };

  return res.json({
    success: true,
    message: 'GPS coordinates updated.',
    coords: FLEET_STORE[proIndex].coords,
  });
});

/**
 * @route   PATCH /api/v1/providers/:id/availability
 * @desc    Toggle online / offline status or vacation mode
 * @access  Private (Provider only)
 */
router.patch('/:id/availability', authenticateToken, (req: Request, res: Response) => {
  const { isOnline, vacationMode } = req.body;
  const proIndex = FLEET_STORE.findIndex((p) => p.id === req.params.id);

  if (proIndex === -1) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }

  if (typeof isOnline === 'boolean') {
    FLEET_STORE[proIndex].isOnline = isOnline;
  }
  if (typeof vacationMode === 'boolean') {
    FLEET_STORE[proIndex].vacationMode = vacationMode;
  }

  return res.json({
    success: true,
    message: 'Availability updated.',
    status: {
      isOnline: FLEET_STORE[proIndex].isOnline,
      vacationMode: FLEET_STORE[proIndex].vacationMode,
    },
  });
});

export default router;
