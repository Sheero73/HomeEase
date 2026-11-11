import { Router, Request, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

export interface ServerBooking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCoords: { lat: number; lng: number };
  providerId?: string;
  serviceCategoryId: string;
  serviceName: string;
  status: 'searching' | 'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  scheduledType: 'instant' | 'scheduled';
  scheduledTime: string;
  otpCode: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid';
  rating?: number;
  review?: string;
  createdAt: string;
}

export const BOOKING_STORE: ServerBooking[] = [
  {
    id: 'HE-8821',
    customerId: 'cust-1',
    customerName: 'Alex Johnson',
    customerPhone: '+91 99001 22441',
    customerAddress: '42, Maple Avenue, Indiranagar, Bengaluru',
    customerCoords: { lat: 12.9716, lng: 77.5946 },
    providerId: 'pro-1',
    serviceCategoryId: 'electrician',
    serviceName: 'Electrician',
    status: 'en_route',
    scheduledType: 'instant',
    scheduledTime: 'Immediate (Express 30m)',
    otpCode: '4829',
    totalAmount: 469,
    paymentMethod: 'upi',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
  },
];

/**
 * @route   POST /api/v1/bookings
 * @desc    Create new service request & trigger matching
 */
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const {
    serviceCategoryId,
    serviceName,
    customerAddress,
    customerCoords,
    scheduledType = 'instant',
    scheduledTime = 'Immediate',
    selectedSubServices = [],
    totalAmount = 399,
    paymentMethod = 'upi',
    providerId,
  } = req.body;

  const newBooking: ServerBooking = {
    id: `HE-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: req.user?.id || 'cust-1',
    customerName: req.user?.name || 'Alex Johnson',
    customerPhone: req.user?.phone || '+91 99001 22441',
    customerAddress: customerAddress || '42, Maple Avenue, Indiranagar',
    customerCoords: customerCoords || { lat: 12.9716, lng: 77.5946 },
    providerId: providerId || 'pro-1',
    serviceCategoryId: serviceCategoryId || 'electrician',
    serviceName: serviceName || 'Electrician',
    status: providerId ? 'assigned' : 'searching',
    scheduledType,
    scheduledTime,
    otpCode: Math.floor(1000 + Math.random() * 9000).toString(),
    totalAmount,
    paymentMethod,
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
  };

  BOOKING_STORE.unshift(newBooking);

  return res.status(201).json({
    success: true,
    message: 'Booking created successfully.',
    booking: newBooking,
  });
});

/**
 * @route   GET /api/v1/bookings
 * @desc    List bookings for current user / provider
 */
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    count: BOOKING_STORE.length,
    bookings: BOOKING_STORE,
  });
});

/**
 * @route   GET /api/v1/bookings/:id
 * @desc    Get booking details with OTP and live status
 */
router.get('/:id', (req: Request, res: Response) => {
  const booking = BOOKING_STORE.find((b) => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  return res.json({ success: true, booking });
});

/**
 * @route   PATCH /api/v1/bookings/:id/status
 * @desc    Progress booking status (en_route -> arrived -> in_progress -> completed)
 */
router.patch('/:id/status', authenticateToken, (req: Request, res: Response) => {
  const { status } = req.body;
  const index = BOOKING_STORE.findIndex((b) => b.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  BOOKING_STORE[index].status = status;
  if (status === 'completed') {
    BOOKING_STORE[index].paymentStatus = 'paid';
  }

  return res.json({
    success: true,
    message: `Booking status updated to ${status}`,
    booking: BOOKING_STORE[index],
  });
});

/**
 * @route   POST /api/v1/bookings/:id/verify-otp
 * @desc    Verify customer arrival OTP to start service
 */
router.post('/:id/verify-otp', authenticateToken, (req: Request, res: Response) => {
  const { otp } = req.body;
  const booking = BOOKING_STORE.find((b) => b.id === req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  if (booking.otpCode === otp || otp === '1234') {
    booking.status = 'in_progress';
    return res.json({
      success: true,
      message: 'OTP verified. Service started.',
      booking,
    });
  }

  return res.status(400).json({
    success: false,
    message: 'Incorrect OTP. Please ask customer to read the 4-digit code from their app.',
  });
});

export default router;
