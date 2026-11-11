import React, { useState, useEffect } from 'react';
import {
  Zap,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
  MapPin,
  Search,
  CheckCircle2,
  Calendar,
  Phone,
  Flame,
  ArrowRight,
  Award,
  ChevronRight,
  Layers,
} from 'lucide-react';
import {
  SERVICE_CATEGORIES,
  MOCK_PROVIDERS,
  MOCK_BOOKINGS,
  MOCK_KYC_DOCUMENTS,
  MOCK_SUPPORT_TICKETS,
  DEFAULT_CUSTOMER_LOCATION,
} from './data/mockData';
import {
  UserRole,
  ServiceCategory,
  ServiceProvider,
  Booking,
  SubService,
  PriceBreakdown,
  KYCDocument,
  SupportTicket,
} from './types';
import { Header } from './components/layout/Header';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { DeviceFrameToggle } from './components/common/DeviceFrameToggle';
import { CategoryGrid } from './components/customer/CategoryGrid';
import { ServiceDetailModal } from './components/customer/ServiceDetailModal';
import { InstantMatchModal } from './components/customer/InstantMatchModal';
import { LiveTrackingView } from './components/customer/LiveTrackingView';
import { NearbyDiscoveryView } from './components/customer/NearbyDiscoveryView';
import { AIDiagnoseModal } from './components/customer/AIDiagnoseModal';
import { BookingHistoryView } from './components/customer/BookingHistoryView';
import { SubscriptionsView } from './components/customer/SubscriptionsView';
import { ProfileView } from './components/customer/ProfileView';
import { AIChatDrawer } from './components/customer/AIChatDrawer';
import { ProviderDashboard } from './components/provider/ProviderDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ApiArchitectureView } from './components/admin/ApiArchitectureView';

export default function App() {
  // Theme & Layout States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Marketplace Datastore State
  const [categories, setCategories] = useState<ServiceCategory[]>(SERVICE_CATEGORIES);
  const [providers, setProviders] = useState<ServiceProvider[]>(MOCK_PROVIDERS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [kycDocs, setKycDocs] = useState<KYCDocument[]>(MOCK_KYC_DOCUMENTS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);

  // Active Modals & Flow States
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [isMatchingOpen, setIsMatchingOpen] = useState<boolean>(false);
  const [pendingBookingData, setPendingBookingData] = useState<{
    selectedSubServices: SubService[];
    scheduledType: 'instant' | 'scheduled';
    scheduledDate: string;
    scheduledTime: string;
    issueDescription: string;
    priceBreakdown: PriceBreakdown;
  } | null>(null);

  // Active Live Tracked Booking (defaults to HE-8821 for instant interactive demo)
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<Booking | null>(
    bookings.find((b) => b.id === 'HE-8821') || bookings[0]
  );

  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);

  // Synchronize Dark Mode class on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handlers for Booking & Matching
  const handleProceedToMatch = (data: {
    selectedSubServices: SubService[];
    scheduledType: 'instant' | 'scheduled';
    scheduledDate: string;
    scheduledTime: string;
    issueDescription: string;
    priceBreakdown: PriceBreakdown;
  }) => {
    setPendingBookingData(data);
    setIsMatchingOpen(true);
  };

  const handleBookingAssigned = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setActiveTrackingBooking(newBooking);
    setIsMatchingOpen(false);
    setSelectedCategory(null);
    setPendingBookingData(null);
    setCurrentTab('activity');
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : b.completedAt,
            }
          : b
      )
    );

    if (activeTrackingBooking && activeTrackingBooking.id === bookingId) {
      setActiveTrackingBooking((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : prev.completedAt,
            }
          : null
      );
    }
  };

  const handleSubmitReview = (bookingId: string, rating: number, review: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, rating, review } : b))
    );
  };

  // Provider Action Handlers
  const handleUpdateProviderStatus = (isOnline: boolean, vacationMode: boolean) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === 'pro-1' ? { ...p, isOnline, vacationMode } : p
      )
    );
  };

  // Admin Action Handlers
  const handleUpdateCategoryPrice = (categoryId: string, newBasePrice: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, basePrice: newBasePrice } : c))
    );
  };

  const handleApproveKYC = (docId: string) => {
    setKycDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, status: 'verified', reviewedAt: new Date().toISOString().split('T')[0] }
          : d
      )
    );
  };

  const handleRejectKYC = (docId: string, reason: string) => {
    setKycDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, status: 'rejected', rejectionReason: reason, reviewedAt: new Date().toISOString().split('T')[0] }
          : d
      )
    );
  };

  const handleResolveTicket = (ticketId: string, resolution: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved', resolution } : t))
    );
  };

  // Quick shortcut simulation from top bar
  const handleQuickSimulateDispatch = () => {
    setActiveRole('customer');
    const elecCat = categories.find((c) => c.id === 'electrician') || categories[0];
    setSelectedCategory(elecCat);
  };

  // Count active bookings for navigation badge
  const activeBookingsCount = bookings.filter(
    (b) => !['completed', 'cancelled'].includes(b.status)
  ).length;

  // Render role-specific content
  const renderAppContent = () => {
    if (activeRole === 'provider') {
      return (
        <ProviderDashboard
          provider={providers[0]}
          activeBooking={activeTrackingBooking}
          onUpdateProviderStatus={handleUpdateProviderStatus}
          onAcceptIncomingJob={(b) => {
            setBookings((prev) => [b, ...prev]);
            setActiveTrackingBooking(b);
          }}
          onUpdateJobStatus={handleUpdateBookingStatus}
        />
      );
    }

    if (activeRole === 'admin') {
      return (
        <AdminDashboard
          categories={categories}
          providers={providers}
          bookings={bookings}
          kycDocuments={kycDocs}
          tickets={supportTickets}
          onUpdateCategoryPrice={handleUpdateCategoryPrice}
          onApproveKYC={handleApproveKYC}
          onRejectKYC={handleRejectKYC}
          onResolveTicket={handleResolveTicket}
        />
      );
    }

    // Customer App Views
    switch (currentTab) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Hero Section with Generated High-Fidelity Asset */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[340px] flex items-center shadow-md">
              {/* Background Photography Asset */}
              <img
                src="/src/assets/images/home_service_hero_1794378388947.jpg"
                alt="HomeEase professional service technician"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-40 dark:opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent" />

              {/* Hero Content */}
              <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-600/90 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Express 30-Min Dispatch
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Verified Home Pros in Bengaluru
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Expert home services, delivered to your doorstep.
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Book certified electricians, plumbers, AC technicians, appliance repair experts, and deep cleaners in 60 seconds with live GPS tracking and upfront transparent pricing.
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const acCat = categories.find((c) => c.id === 'ac-service') || categories[0];
                      setSelectedCategory(acCat);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>Book AC / Electrician</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentTab('diagnose')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Scan Issue with AI Vision</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Trust Strip (4 Metrics adhering to Claim-to-Proof Adjacency) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    30-Minute Express
                  </span>
                  <span className="text-[11px] text-slate-500">Fastest urban arrival</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    100% Police Verified
                  </span>
                  <span className="text-[11px] text-slate-500">Government ID checked</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    30-Day Guarantee
                  </span>
                  <span className="text-[11px] text-slate-500">Free revisit on defects</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    4.88 Avg Rating
                  </span>
                  <span className="text-[11px] text-slate-500">From 140,000+ reviews</span>
                </div>
              </div>
            </div>

            {/* All 20 Household Service Categories Grid */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Explore All Household Services
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tap any category to view standard rate cards, add sub-services, or trigger instant dispatch.
                </p>
              </div>

              <CategoryGrid
                categories={categories}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                onInstantEmergencyBook={(cat) => setSelectedCategory(cat)}
              />
            </div>
          </div>
        );

      case 'search':
        return (
          <NearbyDiscoveryView
            customerLocation={DEFAULT_CUSTOMER_LOCATION}
            providers={providers}
            categories={categories}
            onSelectProvider={(p) => {
              const matchedCat = categories.find((c) => p.specialties.includes(c.id)) || categories[0];
              setSelectedCategory(matchedCat);
            }}
            onBookCategory={(cat) => setSelectedCategory(cat)}
          />
        );

      case 'diagnose':
        return (
          <AIDiagnoseModal
            categories={categories}
            onBookCategory={(cat, issueNote) => {
              setSelectedCategory(cat);
            }}
          />
        );

      case 'activity':
        return (
          <div className="space-y-6">
            {activeTrackingBooking && !['completed', 'cancelled'].includes(activeTrackingBooking.status) ? (
              <LiveTrackingView
                booking={activeTrackingBooking}
                allProviders={providers}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onSubmitReview={handleSubmitReview}
                onOpenSupport={() => setIsAIChatOpen(true)}
              />
            ) : (
              <BookingHistoryView
                bookings={bookings}
                categories={categories}
                onTrackBooking={(b) => setActiveTrackingBooking(b)}
                onRebook={(cat) => setSelectedCategory(cat)}
              />
            )}
          </div>
        );

      case 'amc':
        return <SubscriptionsView />;

      case 'api-architecture':
        return <ApiArchitectureView />;

      case 'profile':
        return (
          <ProfileView
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onOpenSupport={() => setIsAIChatOpen(true)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors`}>
      {/* Top Device & Role Simulator Bar */}
      <DeviceFrameToggle
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={setIsMobileFrame}
        activeRole={activeRole}
        onSelectRole={setActiveRole}
        onQuickSimulateDispatch={handleQuickSimulateDispatch}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenArchitecture={() => {
          setActiveRole('customer');
          setCurrentTab('api-architecture');
        }}
      />

      {/* Main Container Layout */}
      {isMobileFrame ? (
        /* Mobile Device Mockup Frame (iPhone 16 Pro styling) */
        <div className="py-6 px-4 flex justify-center items-center bg-slate-900/60 min-h-[calc(100vh-42px)]">
          <div className="w-full max-w-[410px] h-[840px] bg-white dark:bg-slate-950 rounded-[48px] shadow-2xl border-[10px] border-slate-800 dark:border-slate-800 flex flex-col overflow-hidden relative ring-1 ring-slate-700/50">
            {/* iOS Dynamic Island & Status Bar */}
            <div className="h-10 bg-white dark:bg-slate-950 flex items-center justify-between px-6 pt-2 shrink-0 select-none z-30">
              <span className="text-[12px] font-bold tracking-tight">9:41</span>
              {/* Dynamic Island pill */}
              <div className="w-24 h-5 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                  H
                </span>
                <span className="font-bold text-sm tracking-tight">HomeEase</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                  Bengaluru
                </span>
              </div>
            </div>

            {/* Scrollable Mobile Body */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
              {renderAppContent()}
            </div>

            {/* Mobile Bottom Tab Bar */}
            <MobileTabBar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              activeBookingCount={activeBookingsCount}
            />

            {/* iOS Home Indicator Bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full z-50 pointer-events-none" />
          </div>
        </div>
      ) : (
        /* Full Responsive Desktop / Web App */
        <div className="min-h-screen flex flex-col">
          <Header
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            activeRole={activeRole}
            onSelectRole={setActiveRole}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            unreadNotifications={activeBookingsCount}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
            {renderAppContent()}
          </main>

          {/* Desktop Footer adhering to Anti-Slop Cleanliness */}
          <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 bg-white dark:bg-slate-900 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-medium">
                <span className="font-bold text-slate-900 dark:text-white">HomeEase</span>
                <span>·</span>
                <span>Household Services Marketplace</span>
                <span>·</span>
                <span>30-Day Workmanship Guarantee</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Bangalore · Mumbai · Delhi NCR · Hyderabad</span>
                <span>© 2026 HomeEase Technologies</span>
              </div>
            </div>
          </footer>

          {/* Mobile Bottom Bar when viewport is small on responsive view */}
          <MobileTabBar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            activeBookingCount={activeBookingsCount}
          />
        </div>
      )}

      {/* Service Detail & Customization Modal */}
      {selectedCategory && (
        <ServiceDetailModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onProceedToMatch={handleProceedToMatch}
        />
      )}

      {/* Uber-style Instant Match Radar Modal */}
      {isMatchingOpen && selectedCategory && pendingBookingData && (
        <InstantMatchModal
          categoryName={selectedCategory.name}
          categoryId={selectedCategory.id}
          customerLocation={DEFAULT_CUSTOMER_LOCATION}
          allProviders={providers}
          selectedSubServices={pendingBookingData.selectedSubServices}
          priceBreakdown={pendingBookingData.priceBreakdown}
          scheduledType={pendingBookingData.scheduledType}
          scheduledDate={pendingBookingData.scheduledDate}
          scheduledTime={pendingBookingData.scheduledTime}
          issueDescription={pendingBookingData.issueDescription}
          onCancel={() => setIsMatchingOpen(false)}
          onMatchedAndAssigned={handleBookingAssigned}
        />
      )}

      {/* AI Concierge Chat Drawer */}
      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        categories={categories}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setIsAIChatOpen(false);
        }}
      />
    </div>
  );
}
