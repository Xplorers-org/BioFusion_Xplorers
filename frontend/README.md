# Parkinson's Disease Prediction Web Application

A modern, AI-powered web application for Parkinson's disease prediction using voice analysis. Built with **Next.js 15 (App Router)**, **TypeScript**, **shadcn/ui**, **Framer Motion**, and following **Clean Architecture** patterns (MVP - Model-View-Presenter).

![Tech Stack](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff69b4)

## 🎯 Features

- 🎤 **Voice Recording & Upload**: Record directly in browser or upload audio files
- 📊 **AI Analysis**: Advanced ML-based voice analysis for Parkinson's prediction
- 📈 **Interactive Charts**: Recharts visualizations (Radar, Bar, Line charts)
- 🌓 **Dark/Light Mode**: System-aware theming with next-themes
- 📱 **Responsive Design**: Mobile-first, fully responsive UI
- ✨ **Smooth Animations**: Framer Motion page transitions and micro-interactions
- 🎨 **Modern UI**: shadcn/ui components with Radix UI primitives
- 🔐 **Authentication**: Login/Sign up flows (mock implementation)
- 📜 **Recording History**: Track and manage all voice recordings
- ⚙️ **Settings**: User preferences and theme customization

## 🏗️ Architecture

This project follows the **MVP (Model-View-Presenter)** pattern with clean architecture principles:

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # Dashboard layout group
│   │   ├── dashboard/
│   │   ├── voice-recording/
│   │   ├── results/[id]/
│   │   ├── history/
│   │   └── settings/
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── domain/                       # Business Logic Layer
│   ├── models/                   # Domain entities & types
│   │   └── types.ts
│   └── services/                 # Service interfaces & implementations
│       ├── interfaces.ts
│       ├── auth-service.ts
│       ├── voice-recording-service.ts
│       └── prediction-service.ts
│
├── presentation/                 # Presentation Layer
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui base components
│   │   ├── layout/               # Layout components (Sidebar, Navbar)
│   │   ├── auth/                 # Auth forms
│   │   ├── voice-recording/      # Voice recording multi-step form
│   │   ├── results/              # Results display with charts
│   │   ├── dashboard/            # Dashboard widgets
│   │   ├── history/              # History list
│   │   ├── settings/             # Settings form
│   │   └── providers/            # Context providers
│   ├── presenters/               # MVP Presenters
│   │   ├── auth-presenter.ts
│   │   └── voice-recording-presenter.ts
│   ├── stores/                   # State management (Zustand)
│   │   └── index.ts
│   └── hooks/                    # Custom React hooks
│       └── use-toast.ts
│
└── lib/                          # Utilities
    └── utils.ts
```

### Architecture Layers

1. **Domain Layer** (`/domain`)
   - Pure business logic
   - Domain models and entities
   - Service interfaces and implementations
   - No dependencies on UI or frameworks

2. **Presentation Layer** (`/presentation`)
   - **Views**: React components (UI)
   - **Presenters**: Business logic coordinators
   - **Stores**: State management (Zustand)
   - Handles user interactions and UI updates

3. **App Layer** (`/app`)
   - Next.js routing and pages
   - Layout compositions
   - Server/Client component coordination

## 📦 Dependencies

### Core Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.3.3"
}
```

### UI Components & Styling
```json
{
  "@radix-ui/react-*": "Latest",        // UI primitives
  "class-variance-authority": "^0.7.0", // Component variants
  "clsx": "^2.1.0",                     // Class name utilities
  "tailwindcss": "^3.4.1",              // Styling
  "tailwindcss-animate": "^1.0.7",      // Animations
  "lucide-react": "^0.315.0"            // Icons
}
```

### Animation Libraries
```json
{
  "framer-motion": "^11.0.3",           // Animations & transitions
  "lottie-react": "^2.4.0"              // Lottie animations
}
```

### Data Visualization
```json
{
  "recharts": "^2.10.3"                 // Charts
}
```

### State Management & Forms
```json
{
  "zustand": "^4.5.0",                  // State management
  "react-hook-form": "^7.49.3",         // Form handling
  "@hookform/resolvers": "^3.3.4",      // Form validation
  "zod": "^3.22.4"                      // Schema validation
}
```

### Theming
```json
{
  "next-themes": "^0.2.1"               // Dark/Light mode
}
```

### Utilities
```json
{
  "date-fns": "^3.2.0",                 // Date formatting
  "tailwind-merge": "^2.2.0"            // Tailwind utilities
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. **Clone or use this project**
   ```bash
   cd e:\Parkinson
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 📱 Key Pages & Features

### 1. Landing Page (`/`)
- Hero section with gradient background
- Feature showcase
- Smooth scroll animations
- CTA buttons

### 2. Authentication Pages
- **Login** (`/login`): Sign in form with validation
- **Sign Up** (`/signup`): Registration form

### 3. Dashboard (`/dashboard`)
- Statistics cards (Total recordings, Average score, Trends)
- Quick action buttons
- Recent recordings widget
- Responsive grid layout

### 4. Voice Recording Form (`/voice-recording`)
**Multi-step form with animations:**
- **Step 1**: Information & Instructions
- **Step 2**: Upload/Record voice
  - File upload with drag & drop support
  - Live audio recording (WebRTC)
  - Recording timer with visual feedback
- **Step 3**: Preview & playback
- **Step 4**: Submit & Analyze
  - Loading animation during processing
  - Progress indicator

**Technical highlights:**
- Uses MediaRecorder API for browser recording
- File validation (audio formats: MP3, WAV, OGG, WebM)
- Real-time recording timer
- Audio playback preview
- Framer Motion step transitions

### 5. Results Page (`/results/[id]`)
**Comprehensive results display:**
- **Prediction Score**: Large animated score with risk level
- **Progress Bar**: Visual risk indicator
- **Confidence Level**: AI confidence percentage
- **Radar Chart**: Voice feature breakdown (Jitter, Shimmer, HNR, Pitch)
- **Bar Chart**: Score comparison with benchmarks
- **Recommendations**: Actionable advice based on results
- **Disclaimer**: Medical advisory

**Charts & Visualizations:**
- Recharts library integration
- Interactive tooltips
- Responsive container sizing
- Color-coded risk levels

### 6. History Page (`/history`)
- List of all recordings
- Sortable/filterable table
- Quick actions (View, Download, Delete)
- Date formatting

### 7. Settings Page (`/settings`)
- Profile management
- Theme toggle (Dark/Light)
- Notification preferences

## 🎨 UI/UX Features

### Design System
- **Colors**: Custom HSL-based color system for dark/light mode
- **Typography**: Inter font family
- **Spacing**: Consistent 8px grid system
- **Shadows**: Layered shadow system
- **Border Radius**: Consistent rounded corners

### Animations
```typescript
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// Staggered children
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  />
))}

// Button hover effects
<motion.button whileHover={{ scale: 1.05 }} />
```

### Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1400px /* Extra large */
```

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support
- Color contrast compliance

## 🎯 Component Examples

### Voice Recording Form Component
Located at: `src/presentation/components/voice-recording/voice-recording-form.tsx`

**Features:**
- 4-step wizard with progress indicator
- Audio recording with MediaRecorder API
- File upload with validation
- Preview with audio player
- Animated transitions between steps
- Form validation
- Loading states

### Results Display Component
Located at: `src/presentation/components/results/results-display.tsx`

**Features:**
- Animated score reveal
- Multiple chart types (Radar, Bar)
- Risk level indicators
- Feature breakdown
- Recommendations list
- Download/Share actions
- Medical disclaimer

### Modern Sidebar Component
Located at: `src/presentation/components/layout/sidebar.tsx`

**Features:**
- Collapsible sidebar (desktop)
- Overlay on mobile
- Active route highlighting
- Smooth expand/collapse animation
- Icon-only mode
- Logo branding
- Logout button

## 🔧 Configuration Files

### `tailwind.config.ts`
- Custom color system (HSL-based)
- Dark mode configuration
- Custom animations
- Typography settings
- Plugin configuration

### `tsconfig.json`
- Path aliases configured
- Strict type checking
- Modern ES features

### `next.config.mjs`
- Image optimization
- Environment variables
- Build configuration

## 🎨 Styling & Theming

### Dark/Light Mode
```typescript
// Implemented with next-themes
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
```

### CSS Variables
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 217 91% 60%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

### Component Styling Pattern
```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // Allow prop overrides
)} />
```

## 📊 State Management

Using **Zustand** for lightweight state management:

```typescript
// stores/index.ts
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

## 🔌 API Integration

Currently using **mock services**. To integrate with real API:

1. Update service implementations in `src/domain/services/`
2. Add API client (e.g., axios, fetch)
3. Configure environment variables
4. Update presenter methods

```typescript
// Example: src/domain/services/prediction-service.ts
async predictParkinson(recordingId: string): Promise<PredictionResult> {
  const response = await fetch(`/api/predict/${recordingId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_URL=https://app.example.com
```

## 📚 Code Organization Best Practices

1. **Component Structure**
   ```typescript
   // 1. Imports (external → internal)
   // 2. Types/Interfaces
   // 3. Component definition
   // 4. Styles/Constants
   // 5. Export
   ```

2. **Naming Conventions**
   - Components: PascalCase (`VoiceRecordingForm`)
   - Files: kebab-case (`voice-recording-form.tsx`)
   - Functions: camelCase (`handleSubmit`)
   - Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

3. **Folder Structure**
   - Group by feature, not by type
   - Colocate related files
   - Keep components small and focused

## 🧪 Testing (Recommended Setup)

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
```

Example test:
```typescript
import { render, screen } from '@testing-library/react';
import { VoiceRecordingForm } from './voice-recording-form';

test('renders recording form', () => {
  render(<VoiceRecordingForm />);
  expect(screen.getByText('Voice Analysis')).toBeInTheDocument();
});
```

## 📈 Performance Optimization

- ✅ Next.js Image optimization
- ✅ Code splitting (automatic with App Router)
- ✅ Lazy loading for heavy components
- ✅ Memoization where needed
- ✅ Optimized bundle size
- ✅ CSS-in-JS with zero runtime (Tailwind)

## 🎯 Next Steps

1. **Backend Integration**
   - Connect to real ML API for predictions
   - Implement authentication service
   - Add file upload to cloud storage

2. **Enhanced Features**
   - Export results as PDF
   - Email reports
   - Multi-language support
   - Advanced analytics dashboard

3. **Testing**
   - Unit tests with Jest
   - Integration tests
   - E2E tests with Playwright

4. **Performance**
   - Implement caching strategies
   - Add service worker for offline support
   - Optimize images further

## 🤝 Contributing

This is a template project. Feel free to customize and extend it for your needs.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful component library
- **Radix UI** for accessible primitives
- **Framer Motion** for smooth animations
- **Recharts** for data visualization
- **Next.js Team** for the amazing framework

---

**Built with ❤️ using Next.js 15, TypeScript, and modern web technologies**

For questions or support, please create an issue in the repository.
