import { Router, Request, Response } from 'express';
import { authenticateToken, requireRoles } from '../middleware/auth';
import { BOOKING_STORE } from './bookings.routes';
import { FLEET_STORE } from './providers.routes';

const router = Router();

const KYC_STORE = [
  {
    id: 'kyc-1',
    providerId: 'pro-1',
    providerName: 'Rajesh Kumar',
    documentTitle: 'Government Aadhaar / National ID',
    status: 'verified',
    submittedAt: '2026-09-12',
  },
  {
    id: 'kyc-3',
    providerId: 'pro-9',
    providerName: 'Deepak Rao',
    documentTitle: 'State Electrician Trade License & Police Clearance',
    status: 'pending',
    submittedAt: '2026-11-10',
  },
];

const TICKET_STORE = [
  {
    id: 'TICK-1029',
    customerName: 'Alex Johnson',
    subject: 'Request GST Invoice for Company Reimbursement',
    priority: 'low',
    status: 'resolved',
    resolution: 'GST invoice emailed to customer.',
  },
  {
    id: 'TICK-1034',
    customerName: 'Alex Johnson',
    subject: 'Technician Route Inquiry',
    priority: 'medium',
    status: 'in_progress',
  },
];

/**
 * @route   GET /api/v1/admin/analytics
 * @desc    Aggregate marketplace GMV, take rates, active fleet, and demand heat
 */
router.get('/analytics', authenticateToken, (req: Request, res: Response) => {
  const gmv = BOOKING_STORE.reduce((acc, b) => acc + b.totalAmount, 1420500);
  const platformFee = Math.round(gmv * 0.15);

  return res.json({
    success: true,
    metrics: {
      grossMerchandiseValue: gmv,
      platformCommissions: platformFee,
      takeRatePercent: 15,
      totalRegisteredProviders: FLEET_STORE.length,
      onlineFleetCount: FLEET_STORE.filter((p) => p.isOnline).length,
      totalCompletedBookings: 198420,
      activeDispatchQueue: BOOKING_STORE.filter((b) => b.status === 'en_route').length,
      pendingKycCount: KYC_STORE.filter((k) => k.status === 'pending').length,
      openSupportTickets: TICKET_STORE.filter((t) => t.status !== 'resolved').length,
    },
  });
});

/**
 * @route   GET /api/v1/admin/kyc
 * @desc    Retrieve pending and approved provider KYC documents
 */
router.get('/kyc', authenticateToken, (req: Request, res: Response) => {
  return res.json({
    success: true,
    documents: KYC_STORE,
  });
});

/**
 * @route   PATCH /api/v1/admin/kyc/:id
 * @desc    Approve or reject provider KYC application
 */
router.patch('/kyc/:id', authenticateToken, (req: Request, res: Response) => {
  const { status, rejectionReason } = req.body;
  const doc = KYC_STORE.find((k) => k.id === req.params.id);

  if (!doc) {
    return res.status(404).json({ success: false, message: 'Document not found.' });
  }

  doc.status = status;
  return res.json({
    success: true,
    message: `KYC document status updated to ${status}`,
    document: doc,
  });
});

export default router;
