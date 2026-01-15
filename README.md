# Hindalco C-PSMS - Centralized Permit & Safety Management System

A comprehensive digital permit-to-work and visitor management system designed for industrial safety compliance and operational efficiency at manufacturing facilities.

## 🎯 Project Overview

The Centralized Permit & Safety Management System (C-PSMS) is a full-stack web application that modernizes industrial safety protocols by digitizing permit workflows, visitor management, and real-time plant monitoring. Built for Hindalco Industries, this system streamlines safety compliance while providing real-time visibility into plant operations.

**Live Demo:** [https://hindalco-cpsms.vercel.app](https://hindalco-cpsms.vercel.app)

## ✨ Key Features

### 🔐 Dual Authentication System
- Separate login flows for employees and visitors
- Employee authentication via company ID and DOB
- Visitor authentication via pre-issued visitor ID
- Session management with persistent authentication

### 👥 Role-Based Access Control (RBAC)
- Department-specific dashboards (Security, Safety, Operations)
- Customized UI and permissions based on user role
- Security personnel can manage visitor requests
- Safety personnel can review and approve high-risk permits

### 📋 Digital Permit Management
- Streamlined permit creation workflow
- Automated risk assessment system
- Real-time permit status tracking
- Complete audit trail with status history
- QR code generation for permit validation

### 🗺️ Interactive Plant Monitoring
- Live map visualization using Leaflet
- Real-time permit location tracking
- Color-coded risk indicators (Low, Medium, High)
- Active visitor location monitoring
- Quick-access permit details from map pins

### 🎫 Visitor Management
- Visitor pass request system
- Approval workflow integration
- QR code-based visitor passes
- Entry/exit time tracking
- Purpose and duration management

### 📊 Real-Time Dashboard
- Active permit statistics
- Pending approval queue
- High-risk work alerts
- Recent visitor activity
- Department-specific metrics

### 🔔 Notification System
- Real-time approval notifications
- Permit status updates
- Visitor request alerts
- Role-based notification filtering

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.5.9 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Component Library:** ShadCN UI (Radix UI primitives)
- **Forms:** React Hook Form + Zod validation
- **Maps:** Leaflet.js
- **Charts:** Recharts

### Backend
- **Framework:** Java Spring Boot
- **Database:** PostgreSQL
- **API:** RESTful architecture
- **Authentication:** JWT-based

### DevOps & Deployment
- **Hosting:** Vercel
- **CI/CD:** GitHub Actions
- **Version Control:** Git

## 📁 Project Structure

```
hindalco-cpsms/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── login/             # Authentication pages
│   │   ├── permits/           # Permit management
│   │   ├── visitor/           # Visitor management
│   │   ├── map/               # Plant map view
│   │   ├── notifications/     # Notification center
│   │   └── scan/              # QR code scanner
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   └── dashboard/        # Dashboard widgets
│   ├── lib/                   # Business logic & utilities
│   │   ├── actions.ts        # Server actions
│   │   ├── data.ts           # Data layer (mock)
│   │   ├── types.ts          # TypeScript types
│   │   └── utils.ts          # Helper functions
│   ├── context/               # React context providers
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
└── docs/                      # Documentation

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gitanaskhan26/Hindalco-CPSMS.git
   cd Hindalco-CPSMS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:9003
   ```

### Available Scripts

```bash
npm run dev          # Start development server on port 9003
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler check
```

## 👤 Demo Credentials

### Employee Login
- **Employee Code:** `12345`
- **Date of Birth:** `1990-05-15`
- **Department:** Safety

### Alternative Employees
- **Code:** `67890` | **DOB:** `1985-08-20` | **Dept:** Security
- **Code:** `23456` | **DOB:** `1992-03-10` | **Dept:** Operations

### Visitor Login
- **Visitor ID:** `V-001`
- **Date of Birth:** `1995-07-25`

## 🏗️ System Architecture

The application is built with a full-stack architecture:

```
┌──────────────┐      ┌──────────────────┐
│   Next.js    │◄────►│   Java Spring    │
│   Frontend   │      │   Boot Backend   │
└──────────────┘      └────────┬─────────┘
                               │
                      ┌────────▼─────────┐
                      │   PostgreSQL     │
                      │    Database      │
                      └──────────────────┘
```

**Architecture Benefits:**
- Independent scaling of frontend and backend
- Enhanced security with separated concerns
- Enterprise-grade database with PostgreSQL
- RESTful API communication
- JWT-based authentication
- Type-safe development (TypeScript + Java)

## 🔑 Key Technical Highlights

### Type Safety
- Full TypeScript implementation
- Strict type checking enabled
- Zod schema validation for runtime safety

### Performance Optimizations
- React Server Components for reduced bundle size
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Efficient client-side caching

### Security Features
- Secure authentication flow
- Protected server actions
- XSS prevention
- CSRF protection via Next.js
- Session management

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Accessible UI components (WCAG compliant)

## 📱 Features by Role

### Security Department
- ✅ Request visitor passes
- ✅ View active visitors on map
- ✅ Scan QR codes for verification
- ✅ Monitor visitor entry/exit logs

### Safety Department
- ✅ Review permit applications
- ✅ Approve/reject permits
- ✅ Monitor high-risk work
- ✅ Access complete permit history

### All Employees
- ✅ Create work permits
- ✅ View plant map
- ✅ Track permit status
- ✅ Receive notifications
- ✅ Download QR codes

## 🎨 UI/UX Features

- **Modern Design:** Clean, professional interface aligned with industrial standards
- **Intuitive Navigation:** Role-based sidebar with contextual menu items
- **Real-time Updates:** Live dashboard metrics and notification system
- **Visual Indicators:** Color-coded risk levels and status badges
- **Interactive Elements:** Clickable map pins, dialogs, and modals
- **Accessibility:** Keyboard navigation, screen reader support, ARIA labels

## 📈 Future Enhancements

### Feature Additions
- [ ] Mobile application (React Native)
- [ ] Email/SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Document management system
- [ ] Offline mode support
- [ ] Multi-language support

### DevOps
- [ ] Docker containerization
- [ ] Kubernetes orchestration
- [ ] Automated testing (Jest, Cypress)
- [ ] Performance monitoring
- [ ] Load balancing

## 🤝 Contributing

This is a professional portfolio project. For collaboration inquiries, please reach out via the contact information below.

## 📧 Contact

**Developer:** Anas Khalid 
**Email:** anaskhan.ssif@gmail.com  
**LinkedIn:** https://www.linkedin.com/in/anas-khalid  
**GitHub:** [@Gitanaskhan26](https://github.com/Gitanaskhan26)

---

**Note:** Full-stack application with Java Spring Boot backend and PostgreSQL database.
