# 🩺 MediCare Connect – Hospital Appointment & Healthcare Management System

### MediCare Connect is a modern, secure, and fully responsive healthcare platform that connects patients with verified doctors. Users can easily search for specialists, schedule appointments, make secure online payments, and manage their healthcare activities through dedicated dashboards. The platform also provides role-based access for patients, doctors, and administrators, ensuring an efficient healthcare management experience.

---

## Technologies Used

* **Frontend Framework:** React.js & Next.js (App Router)
* **Authentication:** Better Auth (with JWT Authentication)
* **Styling & UI Components:** Tailwind CSS (v4) and HeroUI
* **Animations:** Framer Motion
* **State & Data Fetching:** React Hooks (`useState`, `useEffect`), Native Fetch API
* **Database & Backend:** MongoDB (via Node.js & Express.js REST API)
* **Payments:** Stripe Checkout Integration
* **Notifications:** React Hot Toast
* **Icons:** Lucide React & React Icons
* **Deployment:** Vercel

---

## Features

1. **Secure Authentication & Authorization:** Robust user sign-up and sign-in workflows with protected routing and role-based access control powered by Better Auth.
2. **Role-Based Dashboards:** Fully customized dashboards tailored specifically for Patients, Doctors, and Administrators, featuring personalized navigation and unique permissions.
3. **Advanced Doctor Discovery:** Smart search and filter mechanics to browse verified doctors by specialization, hospital, experience, consultation fee, and real-time availability.
4. **Dynamic Profiles & SEO:** Server-rendered dynamic doctor detail pages with custom loading states, built-in 404 handling, and SEO-friendly metadata.
5. **Seamless Appointment Booking:** Intuitive scheduling interface allowing patients to select exact dates and available time slots prior to checkout.
6. **Stripe Payment Integration:** Secure consultation fee processing utilizing Stripe Hosted Checkout with encrypted session data handling.
7. **Doctor Verification Pipeline:** Dedicated administrative controls to review professional medical credentials and approve or reject verification requests.
8. **Comprehensive Appointment Management:** Specialized panels for patients to track bookings, doctors to manage clinical consultations, and admins to monitor global platform activities.
9. **Responsive Modern UI:** A beautifully optimized layout using Tailwind CSS and HeroUI components that adapts seamlessly to mobile, tablet, and desktop viewports.
10. **Robust Error & Status Handling:** Professional boundary handling across the platform, including unauthorized entry screens, custom loading animations, error boundaries, and custom 404 pages.