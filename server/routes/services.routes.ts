import { Router, Request, Response } from 'express';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

export interface ServiceCategoryEntity {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  emergencyAvailable: boolean;
  estimatedDuration: string;
  isActive: boolean;
  subServices: { id: string; name: string; price: number; durationMinutes: number }[];
}

export let CATEGORIES_STORE: ServiceCategoryEntity[] = [
  {
    id: 'electrician',
    name: 'Electrician',
    slug: 'electrician',
    description: 'Switchboard repair, short circuits, appliance wiring & fan installations',
    basePrice: 199,
    emergencyAvailable: true,
    estimatedDuration: '45 mins',
    isActive: true,
    subServices: [
      { id: 'elec-1', name: 'Switchboard / Socket Repair', price: 149, durationMinutes: 30 },
      { id: 'elec-2', name: 'Ceiling Fan Installation / Repair', price: 249, durationMinutes: 45 },
      { id: 'elec-3', name: 'MCB / Fuse Box Troubleshooting', price: 349, durationMinutes: 60 },
    ],
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Leak detection, pipe repairs, tap installation & drain unclogging',
    basePrice: 199,
    emergencyAvailable: true,
    estimatedDuration: '45 mins',
    isActive: true,
    subServices: [
      { id: 'plumb-1', name: 'Leaking Tap / Pipe Repair', price: 199, durationMinutes: 35 },
      { id: 'plumb-2', name: 'Drain / Sink Blockage Removal', price: 349, durationMinutes: 50 },
    ],
  },
  {
    id: 'ac-service',
    name: 'AC Service',
    slug: 'ac-service',
    description: 'Deep foam jet cleaning, indoor/outdoor coil washing & anti-rust spray',
    basePrice: 499,
    emergencyAvailable: true,
    estimatedDuration: '60 mins',
    isActive: true,
    subServices: [
      { id: 'ac-1', name: 'Foam Jet Deep AC Service', price: 549, durationMinutes: 60 },
      { id: 'ac-2', name: 'Anti-Rust Coating Protection', price: 299, durationMinutes: 30 },
    ],
  },
  {
    id: 'ac-repair',
    name: 'AC Repair',
    slug: 'ac-repair',
    description: 'Cooling issues, gas refill (R32/R410A), PCB repair & water leakage',
    basePrice: 299,
    emergencyAvailable: true,
    estimatedDuration: '60 mins',
    isActive: true,
    subServices: [
      { id: 'acr-1', name: 'AC Not Cooling Diagnosis', price: 299, durationMinutes: 45 },
      { id: 'acr-2', name: 'Full Refrigerant Gas Top-Up', price: 1899, durationMinutes: 75 },
    ],
  },
];

/**
 * @route   GET /api/v1/services
 * @desc    Get all active service categories and catalog
 * @access  Public
 */
router.get('/', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    count: CATEGORIES_STORE.length,
    categories: CATEGORIES_STORE,
  });
});

/**
 * @route   GET /api/v1/services/:id
 * @desc    Get service category details by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  const cat = CATEGORIES_STORE.find((c) => c.id === req.params.id);
  if (!cat) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }
  return res.json({ success: true, category: cat });
});

/**
 * @route   POST /api/v1/services
 * @desc    Admin: Create new household service category
 * @access  Private (Admin role required)
 */
router.post('/', authenticateToken, requireRoles('admin'), (req: Request, res: Response) => {
  const { name, slug, description, basePrice, emergencyAvailable = false, estimatedDuration = '45 mins' } = req.body;

  if (!name || !basePrice) {
    return res.status(400).json({ success: false, message: 'Name and basePrice are required.' });
  }

  const newCat: ServiceCategoryEntity = {
    id: slug || name.toLowerCase().replace(/\s+/g, '-'),
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    description: description || '',
    basePrice: Number(basePrice),
    emergencyAvailable: Boolean(emergencyAvailable),
    estimatedDuration,
    isActive: true,
    subServices: [],
  };

  CATEGORIES_STORE.push(newCat);

  return res.status(201).json({
    success: true,
    message: 'Service category created.',
    category: newCat,
  });
});

/**
 * @route   PUT /api/v1/services/:id
 * @desc    Admin: Update existing service category rate card & details
 * @access  Private (Admin role required)
 */
router.put('/:id', authenticateToken, requireRoles('admin'), (req: Request, res: Response) => {
  const index = CATEGORIES_STORE.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }

  const { name, description, basePrice, emergencyAvailable, isActive } = req.body;
  if (name !== undefined) CATEGORIES_STORE[index].name = name;
  if (description !== undefined) CATEGORIES_STORE[index].description = description;
  if (basePrice !== undefined) CATEGORIES_STORE[index].basePrice = Number(basePrice);
  if (emergencyAvailable !== undefined) CATEGORIES_STORE[index].emergencyAvailable = Boolean(emergencyAvailable);
  if (isActive !== undefined) CATEGORIES_STORE[index].isActive = Boolean(isActive);

  return res.json({
    success: true,
    message: 'Category updated.',
    category: CATEGORIES_STORE[index],
  });
});

/**
 * @route   POST /api/v1/services/:id/subservices
 * @desc    Admin: Add a granular task or add-on subservice to category
 * @access  Private (Admin role required)
 */
router.post('/:id/subservices', authenticateToken, requireRoles('admin'), (req: Request, res: Response) => {
  const cat = CATEGORIES_STORE.find((c) => c.id === req.params.id);
  if (!cat) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }

  const { name, price, durationMinutes = 30 } = req.body;
  const subId = `${cat.id}-${cat.subServices.length + 1}`;
  const newSub = { id: subId, name, price: Number(price), durationMinutes: Number(durationMinutes) };

  cat.subServices.push(newSub);

  return res.status(201).json({
    success: true,
    message: 'Subservice added.',
    subService: newSub,
  });
});

export default router;
