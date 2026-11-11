import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export interface LocationUpdatePayload {
  providerId: string;
  bookingId?: string;
  lat: number;
  lng: number;
  speedKmh?: number;
  headingDegrees?: number;
  timestamp: string;
}

export interface DispatchResponsePayload {
  bookingId: string;
  providerId: string;
  action: 'accept' | 'reject';
}

export interface ChatMessagePayload {
  bookingId: string;
  senderId: string;
  senderRole: 'customer' | 'provider';
  text: string;
  timestamp: string;
}

export class WebSocketManager {
  private io: SocketIOServer;
  private activeConnections: Map<string, { socketId: string; role: string; userId: string }> = new Map();
  // Server-authoritative in-memory state of active booking live locations
  private liveProviderLocations: Map<string, LocationUpdatePayload> = new Map();

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      pingTimeout: 30000,
      pingInterval: 10000,
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      const role = socket.handshake.auth?.role || 'customer';
      const userId = socket.handshake.auth?.userId || 'cust-1';

      // Attach session info to socket
      (socket as any).userId = userId;
      (socket as any).role = role;
      next();
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const userId = (socket as any).userId;
      const role = (socket as any).role;

      this.activeConnections.set(socket.id, { socketId: socket.id, role, userId });

      // Join individual user room for direct push alerts
      socket.join(`user:${userId}`);
      if (role === 'provider') {
        socket.join(`provider:${userId}`);
      }

      console.log(`[WebSocket] Connected: socket=${socket.id}, user=${userId}, role=${role}`);

      // 1. Join Booking Room for Real-Time Live Tracking
      socket.on('booking:join', ({ bookingId }: { bookingId: string }) => {
        if (!bookingId) return;
        const roomName = `booking:${bookingId}`;
        socket.join(roomName);

        // Send current authoritative live location if already cached
        const cachedLocation = this.liveProviderLocations.get(bookingId);
        if (cachedLocation) {
          socket.emit('booking:location:sync', cachedLocation);
        }

        socket.to(roomName).emit('presence:joined', { userId, role, timestamp: new Date().toISOString() });
      });

      // 2. Leave Booking Room
      socket.on('booking:leave', ({ bookingId }: { bookingId: string }) => {
        if (!bookingId) return;
        const roomName = `booking:${bookingId}`;
        socket.leave(roomName);
        socket.to(roomName).emit('presence:left', { userId, timestamp: new Date().toISOString() });
      });

      // 3. Provider Real-Time GPS Location Stream
      socket.on('provider:location:ping', (payload: LocationUpdatePayload) => {
        if (!payload.providerId || !payload.lat || !payload.lng) return;

        payload.timestamp = new Date().toISOString();

        if (payload.bookingId) {
          this.liveProviderLocations.set(payload.bookingId, payload);
          // Broadcast to customer tracking room
          this.io.to(`booking:${payload.bookingId}`).emit('booking:location:update', payload);
        }

        // Also broadcast to general dispatch fleet map
        this.io.emit('fleet:location:update', {
          providerId: payload.providerId,
          lat: payload.lat,
          lng: payload.lng,
          timestamp: payload.timestamp,
        });
      });

      // 4. Dispatch Request Response (Accept or Reject from Provider)
      socket.on('dispatch:response', (payload: DispatchResponsePayload) => {
        const { bookingId, providerId, action } = payload;
        console.log(`[Dispatch] Provider ${providerId} ${action}ed booking ${bookingId}`);

        if (action === 'accept') {
          this.io.to(`booking:${bookingId}`).emit('booking:status:updated', {
            bookingId,
            status: 'assigned',
            providerId,
            timestamp: new Date().toISOString(),
          });
        }
      });

      // 5. In-App Direct Chat between Customer and Technician
      socket.on('chat:send', (payload: ChatMessagePayload) => {
        if (!payload.bookingId || !payload.text) return;
        payload.timestamp = new Date().toISOString();

        // Broadcast to both customer and provider in the booking room
        this.io.to(`booking:${payload.bookingId}`).emit('chat:received', payload);
      });

      // 6. Booking Milestone Status Transition
      socket.on('booking:status:change', ({ bookingId, status }: { bookingId: string; status: string }) => {
        this.io.to(`booking:${bookingId}`).emit('booking:status:updated', {
          bookingId,
          status,
          timestamp: new Date().toISOString(),
        });
      });

      // Disconnect lifecycle
      socket.on('disconnect', () => {
        this.activeConnections.delete(socket.id);
        console.log(`[WebSocket] Disconnected: socket=${socket.id}, user=${userId}`);
      });
    });
  }

  /**
   * Server-side trigger to broadcast a new booking request to a candidate provider
   */
  public broadcastDispatchToProvider(providerId: string, dispatchDetails: any) {
    this.io.to(`provider:${providerId}`).emit('dispatch:request:new', dispatchDetails);
  }

  /**
   * Broadcast booking status change to all listeners
   */
  public broadcastBookingStatus(bookingId: string, status: string, meta?: any) {
    this.io.to(`booking:${bookingId}`).emit('booking:status:updated', {
      bookingId,
      status,
      meta,
      timestamp: new Date().toISOString(),
    });
  }

  public getConnectedClientsCount(): number {
    return this.activeConnections.size;
  }
}
