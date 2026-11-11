export type UserRole = 'customer' | 'provider' | 'admin';

export interface LocationCoords {
  lat: number;
  lng: number;
  address: string;
  city?: string;
}

export interface SubService {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  basePrice: number;
  estimatedDuration: string;
  emergencyAvailable: boolean;
  rating: number;
  bookingCount: number;
  badge?: string;
  subServices: SubService[];
  popularTasks: string[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  certifications: string[];
  completedJobs: number;
  hourlyRate: number;
  visitFee: number;
  coords: LocationCoords;
  isOnline: boolean;
  isAvailable: boolean;
  vacationMode: boolean;
  specialties: string[];
  bio: string;
  completionRate: number;
  responseTimeMinutes: number;
  kycStatus: 'verified' | 'pending' | 'unverified';
  vehicleType: 'bike' | 'van' | 'scooter';
  vehiclePlate: string;
  walletBalance: number;
}

export type BookingStatus =
  | 'searching'
  | 'assigned'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface PriceBreakdown {
  base: number;
  subtotal: number;
  emergencySurcharge: number;
  discount: number;
  taxes: number;
  total: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCoords: LocationCoords;
  providerId?: string;
  provider?: ServiceProvider;
  serviceCategoryId: string;
  serviceCategoryName: string;
  selectedSubServices: SubService[];
  status: BookingStatus;
  scheduledType: 'instant' | 'scheduled';
  scheduledDate: string;
  scheduledTime: string;
  issueDescription: string;
  issuePhotos?: string[];
  priceBreakdown: PriceBreakdown;
  paymentMethod: 'upi' | 'card' | 'wallet' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  otpCode: string;
  rating?: number;
  review?: string;
  createdAt: string;
  completedAt?: string;
  etaMinutes?: number;
}

export interface EarningsRecord {
  id: string;
  bookingId: string;
  serviceName: string;
  customerName: string;
  amount: number;
  platformFee: number;
  netPayout: number;
  date: string;
  status: 'credited' | 'withdrawn';
}

export interface KYCDocument {
  id: string;
  providerId: string;
  providerName: string;
  docType: 'national_id' | 'trade_license' | 'police_clearance' | 'skill_cert';
  docNumber: string;
  documentTitle: string;
  status: 'verified' | 'pending' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface SupportTicket {
  id: string;
  bookingId: string;
  customerName: string;
  category: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolution?: string;
}

export interface AIDiagnosisResult {
  problemTitle: string;
  rootCause: string;
  severity: 'emergency' | 'moderate' | 'low';
  recommendedCategory: string;
  categoryId: string;
  estimatedCostRange: string;
  estimatedTime: string;
  suggestedParts: string[];
  recommendedAction: string;
  confidence: number;
}

export interface AMCPlan {
  id: string;
  name: string;
  pricePerYear: number;
  frequency: string;
  benefits: string[];
  isPopular?: boolean;
}
