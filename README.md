# HomeEase 🛠️
> On-demand household services marketplace connecting customers with verified nearby professionals, featuring real-time discovery, live GPS tracking, AI defect diagnosis, and a scalable Node.js/Express + Socket.io backend.

---

## 🚀 Quick Start (Run Locally)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ or v22 recommended)
- **Package Manager**: npm, yarn, or pnpm

### 2. Clone or Download
If cloned from GitHub:
```bash
git clone https://github.com/your-username/homeease.git
cd homeease
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
Copy the example environment file:
```bash
cp .env.example .env
```
*(Optional)* Add your Gemini API Key in `.env` if you want to enable live multimodal image defect diagnosis and AI concierge chat:
```env
GEMINI_API_KEY="your-gemini-api-key"
```
*(The app includes automatic intelligent mock fallbacks if no key is provided)*.

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📦 Production Build & Run

To build and run in production mode:

```bash
# 1. Build optimized client bundle
npm run build

# 2. Run the production server
NODE_ENV=production npm run start
```

---

## 🐙 How to Push to GitHub

If you downloaded or exported the code from AI Studio, run these commands in your project folder:

```bash
# 1. Initialize git repository
git init

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "feat: initial commit of HomeEase marketplace"

# 4. Set main branch
git branch -M main

# 5. Connect to your GitHub repository (create a new empty repo on github.com first)
git remote add origin https://github.com/<your-username>/homeease.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🏗️ Architecture & Features

### 1. Customer App
- **20 Service Categories**: Electrician, Plumber, AC Repair, Cleaning, Pest Control, Appliance Repair, and more.
- **Uber-Style Discovery**: Spatial proximity queries with configurable radius (5–20 km), ETA calculation, and live SVG tracking map.
- **Instant Match & Scheduled Booking**: Real-time dispatch matching with upfront rate calculation.
- **AI Vision Defect Diagnosis**: Multimodal photo inspection powered by Gemini 3.8 Flash.
- **4-Digit Arrival OTP**: Secure handshake verification before service commences.
- **Invoices & Ratings**: Itemized GST tax invoices and verified customer reviews.

### 2. Service Provider Portal
- **Online/Offline Availability Switch**: Real-time broadcast status for dispatch engine.
- **15-Second Dispatch Radar**: Incoming request alert with audio ping and accept/reject timer.
- **Work Verification**: Technician enters customer's 4-digit OTP to transition status to in-progress.
- **Earnings & KYC**: Daily/monthly payout tracking with platform commission and document verification status.

### 3. Super Admin Portal
- **Marketplace Analytics**: Live GMV, active jobs, platform commissions, and average arrival ETA.
- **KYC Verification Queue**: Document inspection and one-click approvals.
- **Dynamic Rate Cards**: Category-level base pricing adjustments.

### 4. Backend REST API & WebSockets
- **Interactive API Console**: Test live endpoints directly in the UI under the **API Architecture** tab.
- **Endpoints**:
  - `POST /api/v1/auth/otp/send` & `POST /api/v1/auth/otp/verify`
  - `GET /api/v1/providers/nearby`
  - `POST /api/v1/bookings` & `POST /api/v1/bookings/:id/verify-otp`
  - `GET /api/health`
- **Socket.io Rooms**: `booking:{id}` (live coordinates & chat), `provider:{id}` (targeted dispatch alerts).

---

## 🚢 Deployment Options

- **Railway / Render**: Connect your GitHub repo, set build command to `npm run build`, and start command to `npm run start` (listening on `0.0.0.0:$PORT`).
- **Docker**:
  ```dockerfile
  FROM node:22-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  EXPOSE 3000
  CMD ["npm", "run", "start"]
  ```
- **Vercel**: Deploy the static frontend with API routes configured in `/api`.
