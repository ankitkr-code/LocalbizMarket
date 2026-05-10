# LocalbizMarket
<<<<<<< HEAD

LocalbizMarket is a full-stack marketplace for local businesses, investors, business owners, and admins.

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: Firebase Firestore
- AI: DeepSeek or Hugging Face API through the backend
- Payments: Razorpay/Stripe placeholder service

## Run

```bash
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`:

```bash
npm.cmd install
npm.cmd run dev
```

Client: http://localhost:5173  
Server: http://localhost:5000

## Firebase setup

1. Create a Firebase project.
2. In Firebase Authentication, enable Email/Password sign-in.
3. In Project settings, create a Web app and copy the config values into `client/.env.local`:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

4. In Firebase Project settings > Service accounts, generate a private key.
5. Save that JSON file as:

```bash
server/firebase-service-account.json
```

The file is ignored by Git.

## Roles

Users are stored in the Firestore `users` collection with these roles:

- `investor`
- `business_owner`
- `admin`

The frontend sends a Firebase ID token to the backend. Express verifies the token with Firebase Admin and checks the stored role before allowing protected routes.

Role panels:

- Investor: `/dashboard`, `/businesses`, `/wallet`, `/chatbot`
- Business Owner: `/dashboard`, `/add-business`, `/upload-purchase`, `/chatbot`
- Admin: `/dashboard`, `/admin`, `/businesses`, `/add-business`, `/upload-purchase`, `/chatbot`

For a real production app, create the first admin manually in Firestore or through a private admin script instead of allowing public admin signup.
=======
A stock-market-inspired platform for analyzing and investing in local businesses using real-time analytics, LocalCoin (LCO), and AI-powered insights.

