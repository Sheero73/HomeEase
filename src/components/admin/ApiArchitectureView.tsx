import React, { useState } from 'react';
import {
  Server,
  Radio,
  Database,
  Lock,
  Compass,
  Zap,
  Activity,
  Code,
  CheckCircle2,
  Copy,
  ChevronRight,
  Send,
  Layers,
  Shield,
  Smartphone,
  Globe,
} from 'lucide-react';

export const ApiArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rest' | 'sockets' | 'database'>('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/v1/providers/nearby');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleTestApi = async (url: string, method: string = 'GET', body?: any) => {
    setIsLoading(true);
    setApiResponse(null);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/providers/nearby',
      desc: 'Discovers nearest online service providers using GPS coords and radius filter',
      params: 'lat=12.9716&lng=77.5946&radius=10&category=electrician',
      url: '/api/v1/providers/nearby?lat=12.9716&lng=77.5946&radius=10&category=electrician',
    },
    {
      method: 'POST',
      path: '/api/v1/auth/otp/send',
      desc: 'Dispatches 6-digit cryptographic SMS OTP to mobile number',
      body: { phone: '+919900122441', role: 'customer' },
      url: '/api/v1/auth/otp/send',
    },
    {
      method: 'GET',
      path: '/api/v1/bookings',
      desc: 'Retrieves current active & past service bookings with ETA metadata',
      url: '/api/v1/bookings',
    },
    {
      method: 'GET',
      path: '/api/v1/admin/analytics',
      desc: 'Real-time marketplace telemetry, GMV, take rates & active fleet',
      url: '/api/v1/admin/analytics',
    },
    {
      method: 'GET',
      path: '/api/v1/architecture',
      desc: 'Machine-readable OpenAPI and real-time schema specification',
      url: '/api/v1/architecture',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Server className="w-4 h-4" />
            Backend Systems Architecture Specification
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            High-Throughput Node.js/Express + Socket.io Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Enterprise microservices-ready design supporting spatial geolocation discovery (PostGIS & Redis GEO), JWT bearer authentication with role guards, and sub-100ms real-time bidirectional WebSocket synchronization.
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            System Topology
          </button>
          <button
            onClick={() => setActiveTab('rest')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              activeTab === 'rest'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            RESTful Endpoints & Test Console
          </button>
          <button
            onClick={() => setActiveTab('sockets')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              activeTab === 'sockets'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            Socket.io Events & Room Isolation
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              activeTab === 'database'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
          >
            PostGIS & Redis GEO Schemas
          </button>
        </div>
      </div>

      {/* OVERVIEW / TOPOLOGY TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Layer 1: Ingestion & Auth */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                1. Edge & Auth Gateway
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Reverse proxy termination with rate limiting (100 req/min/IP). Issues signed JWT Access Tokens (1h expiry) and Refresh Tokens (30d rotation) with SMS OTP verification via Twilio/Firebase SMS.
              </p>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                Bearer JWT + Role Guard [Customer, Provider, Admin]
              </div>
            </div>

            {/* Layer 2: Spatial Discovery & Matching */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                2. Geolocation Engine
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Combines Redis 7 <code className="text-emerald-600">GEOSEARCH</code> for sub-millisecond driver lookup with PostgreSQL PostGIS spatial indexes (<code className="text-emerald-600">GIST(geom)</code>) for persistent distance and polygonal bounding box queries.
              </p>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                Score = (Rating*15) + (CompRate*0.2) - (DistKm*4)
              </div>
            </div>

            {/* Layer 3: Real-Time Sockets */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                3. Real-Time Socket.io Hub
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Full-duplex WebSocket server on port 3000. Handles technician GPS breadcrumb streaming (3s pings), 15s dispatch countdown timer, in-app messaging, and milestone notifications.
              </p>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                Isolated Rooms: booking:{'{id}'}, provider:{'{id}'}
              </div>
            </div>
          </div>

          {/* Architectural Diagram Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Flow & Dispatch Lifecycle Diagram
            </h3>

            <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs rounded-2xl overflow-x-auto leading-relaxed border border-slate-800">
              <pre>{`[Customer Mobile App]                     [Node.js Express / Socket.io]                   [Provider Partner App]
        |                                                 |                                                 |
        |--- 1. POST /api/v1/bookings ------------------->|                                                 |
        |    (lat, lng, category, subservices)            |--- 2. PostGIS & Redis GEO Search ---------------> [Database]
        |                                                 |<-- Top Scored Candidates Returned ------------- [Database]
        |                                                 |
        |                                                 |--- 3. WS: dispatch:request:new (15s timer) --->|
        |                                                 |       (room: provider:pro-1)                    |
        |<-- 4. WS: matching:scanning (radar ping) -------|                                                 |
        |                                                 |<-- 5. WS: dispatch:response (accept) -----------|
        |                                                 |
        |                                                 |--- 6. DB: Assign provider, Generate OTP --------> [Database]
        |<== 7. WS: booking:status:updated ('en_route') ==|===> 7. WS: booking:status:updated ('en_route') ==|
        |                                                 |                                                 |
        |                                                 |<-- 8. WS: provider:location:ping (every 3s) ---|
        |<-- 9. WS: booking:location:update (live ETA) ---|                                                 |
        |                                                 |                                                 |
        |--- 10. Handshake Arrival: Customer shares OTP ->|                                                 |
        |                                                 |<-- 11. POST /api/v1/bookings/:id/verify-otp ----|
        |<== 12. WS: booking:status:updated ('in_prog') ==|===> 12. Status: in_progress ====================|`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* REST API EXPLORER TAB */}
      {activeTab === 'rest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Endpoint List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                Available REST V1 Endpoints
              </h3>
              <div className="space-y-1.5">
                {endpoints.map((ep) => {
                  const isSelected = selectedEndpoint === `${ep.method} ${ep.path}`;
                  return (
                    <button
                      key={ep.path}
                      onClick={() => {
                        setSelectedEndpoint(`${ep.method} ${ep.path}`);
                        handleTestApi(ep.url, ep.method, ep.body);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all text-xs ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            ep.method === 'GET'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-mono text-slate-800 dark:text-slate-200 truncate">
                          {ep.path}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{ep.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Response Console (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                {selectedEndpoint}
              </span>
              <button
                onClick={() => {
                  const ep = endpoints.find((e) => `${e.method} ${e.path}` === selectedEndpoint);
                  if (ep) handleTestApi(ep.url, ep.method, ep.body);
                }}
                disabled={isLoading}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Execute Request</span>
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 text-xs font-mono text-slate-200 min-h-[300px] max-h-[480px] overflow-y-auto border border-slate-800">
              {isLoading ? (
                <div className="text-slate-400 animate-pulse">Dispatching HTTP request to Express server...</div>
              ) : apiResponse ? (
                <pre>{apiResponse}</pre>
              ) : (
                <div className="text-slate-500">Tap 'Execute Request' to query live backend endpoint.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SOCKET.IO EVENT SPECIFICATION TAB */}
      {activeTab === 'sockets' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Socket.io Event Catalog & Payload Specifications
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly server-authoritative state engine adhering to zero-simulation real-time guidelines.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Event 1: Location Ping */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  EVENT: provider:location:ping (Client → Server)
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950/40 px-2 py-0.5 rounded font-mono">
                  Rate: 1 ping / 3-5 sec
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Pushed by provider mobile app during an active job. Server caches the position and broadcasts delta update to room <code className="font-mono">booking:{'{bookingId}'}</code>.
              </p>
              <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-[11px]">
                {`{
  "providerId": "pro-1",
  "bookingId": "HE-8821",
  "lat": 12.9738,
  "lng": 77.5982,
  "speedKmh": 28.5,
  "headingDegrees": 182,
  "timestamp": "2026-11-11T06:30:15Z"
}`}
              </div>
            </div>

            {/* Event 2: Dispatch Broadcast */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  EVENT: dispatch:request:new (Server → Client)
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-mono">
                  Room: provider:{'{providerId}'}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Pushed exclusively to candidate provider. Client displays full-screen 15s accept/reject modal.
              </p>
              <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-[11px]">
                {`{
  "bookingId": "HE-8821",
  "customerName": "Alex Johnson",
  "category": "Electrician",
  "address": "42, Maple Ave, Indiranagar",
  "distanceKm": 1.4,
  "payout": 450,
  "expiresInSeconds": 15
}`}
              </div>
            </div>

            {/* Event 3: Booking Status Change */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                  EVENT: booking:status:updated (Server → Broadcast)
                </span>
                <span className="text-[10px] bg-purple-50 text-purple-600 dark:bg-purple-950/40 px-2 py-0.5 rounded font-mono">
                  Room: booking:{'{bookingId}'}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Notifies customer and partner synchronously on milestone changes (assigned, en_route, arrived, in_progress, completed).
              </p>
              <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-[11px]">
                {`{
  "bookingId": "HE-8821",
  "status": "arrived",
  "timestamp": "2026-11-11T06:35:40Z"
}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DATABASE & CACHING SCHEMAS TAB */}
      {activeTab === 'database' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Relational PostGIS DDL & Redis Data Structures
            </h3>
            <p className="text-xs text-slate-500">
              Database schema models optimized for spatial indexing, concurrency locks, and high availability.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950 text-slate-200 rounded-2xl text-xs font-mono overflow-x-auto border border-slate-800">
              <span className="text-emerald-400 block mb-2">-- PostgreSQL + PostGIS Spatial Schema</span>
              <pre>{`CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'provider', 'admin')),
    full_name VARCHAR(100) NOT NULL,
    wallet_balance NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE providers (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    is_online BOOLEAN DEFAULT false,
    vacation_mode BOOLEAN DEFAULT false,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    completed_jobs INT DEFAULT 0,
    completion_rate NUMERIC(5, 2) DEFAULT 100.00,
    vehicle_plate VARCHAR(30),
    specialties TEXT[] NOT NULL,
    geom GEOGRAPHY(POINT, 4326) NOT NULL
);

-- Spatial GIST Index for Sub-Millisecond Radius Queries
CREATE INDEX idx_providers_geom ON providers USING GIST (geom);
CREATE INDEX idx_providers_online ON providers (is_online) WHERE is_online = true;

CREATE TABLE bookings (
    id VARCHAR(30) PRIMARY KEY,
    customer_id UUID REFERENCES users(id),
    provider_id UUID REFERENCES providers(id),
    service_category VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    pickup_geom GEOGRAPHY(POINT, 4326) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
