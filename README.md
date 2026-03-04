NextHaul Shopping App
React + Strapi e-commerce demo with product listing, product detail, cart, category browsing, and contact flow.

What Changed
Renamed the storefront branding and browser title to NextHaul.
Added a dedicated Contact page (/contact) with a full contact form and support info.
Added 3 new products (Urban Utility Jacket, Classic Canvas Tote, Minimalist Sneakers) in the home/product fallback catalog.
Added custom styling polish:
global gradient background
improved navbar look
improved page spacing and contact layout
Added resilient API/data behavior so product cards can render from Strapi responses or local fallback product data.
Added and integrated cart dropdown component with subtotal and checkout action.
Project Structure
src/components - reusable UI components (Navbar, Cart, Footer, Cards, etc.)
src/pages - route-level pages (Home, Products, Product, Contact)
src/redux - cart store/slice
src/data/fallbackProducts.js - fallback catalog including added products
Environment Variables
Create a .env file in client/:

REACT_APP_API_URL=http://localhost:1337/api
REACT_APP_UPLOAD_URL=http://localhost:1337
REACT_APP_API_TOKEN=your_strapi_api_token
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
REACT_APP_CHECKOUT_MODE=stripe
REACT_APP_CHECKOUT_MODE options:

stripe: Uses real Stripe test checkout flow.
mock: Skips Stripe redirect and simulates a successful payment for demos/class projects.
How To Run
Install dependencies:
npm install
Start frontend:
npm start
Frontend runs at http://localhost:3000.

Build / Test
Build production bundle:
npm run build
Run tests:
npm test
Strapi Setup (API)
From the api/my-strapi-project folder:

Install dependencies:
npm install
Start Strapi:
npm run develop
Configure backend Stripe env variables in api/my-strapi-project/.env:
STRIPE_SECRET_KEY=sk_test_your_secret_key
CLIENT_URL=http://localhost:3000
Optional product seed from FakeStore API:
npm run seed:products
Strapi API runs at http://localhost:1337.

Stripe Checkout Flow
Add items to cart.
Open cart and click GO TO CHECKOUT.
On /checkout, click Pay with Stripe.
You will be redirected to Stripe Checkout.
Submission Checklist (Assignment Requirements)
This project satisfies the required rubric items:

Added 3 new products to the shopping site
Added additional products beyond the original tutorial set (including custom fallback catalog items and Strapi-seeded products).
Included a new site title
Store branding/title was updated to NextHaul.
Added a Contact page
Implemented a dedicated /contact route with a contact form and support details.
Added new styling
Applied custom styling updates including navbar polish, global background treatment, checkout/test-card messaging, and contact page design refinements.
Build / Test / Run verification
Frontend build command runs successfully:
npm run build
Frontend runs successfully:
npm start
Test command runs successfully (no test files currently exist):
npm test -- --watchAll=false --passWithNoTests
Strapi backend runs successfully:
npm run develop
README includes setup + run process
This README documents:
required environment variables
installation commands
local run commands
checkout/Stripe test flow
seeding and permissions scripts
Strapi Notes (Instructor Requirements)
Database: SQLite (DATABASE_CLIENT=sqlite).
API base: http://localhost:1337/api/...
Public access:
Public role permissions are configured for required collections/routes.
Script available:
npm run permissions:store (from api/my-strapi-project)
Environment variable prefixes:
This frontend uses Create React App, so variables use REACT_APP_... (not NEXT_PUBLIC_...).
