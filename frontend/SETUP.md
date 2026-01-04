# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required dependencies including:
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion
- Recharts
- Zustand
- and more...

## Step 2: Run Development Server

```powershell
npm run dev
```

The application will start at: **http://localhost:3000**

## Step 3: Explore the Application

### Landing Page (/)
- Modern hero section
- Feature showcase
- Click "Sign Up" or "Login" to proceed

### Authentication
- **Login**: `/login` - Use any email/password (mock auth)
- **Sign Up**: `/signup` - Create account (mock)

### Dashboard (`/dashboard`)
After login, you'll see:
- Statistics cards
- Quick action buttons
- Recent recordings

### Voice Recording (`/voice-recording`)
Multi-step form:
1. **Information**: Read instructions
2. **Upload/Record**: 
   - Upload audio file OR
   - Click "Start Recording" to record live
3. **Preview**: Listen to your recording
4. **Submit**: Analyze and get results

### Results (`/results/[id]`)
- Prediction score with risk level
- Radar chart (voice features)
- Bar chart (score comparison)
- Recommendations
- Download/Share options

### History (`/history`)
- View all recordings
- Quick actions (View, Download, Delete)

### Settings (`/settings`)
- Profile settings
- Theme toggle (Dark/Light mode)

## Step 4: Test Features

### Test Voice Recording:
1. Go to `/voice-recording`
2. Click "Next" on step 1
3. Choose either:
   - **Upload**: Select an audio file (MP3, WAV, OGG, WebM)
   - **Record**: Click "Start Recording", speak for 10-30 seconds, click "Stop"
4. Click "Next" to preview
5. Click "Submit & Analyze"
6. You'll be redirected to results page

### Test Dark Mode:
- Click the Sun/Moon icon in the header
- Theme persists across page reloads

### Test Sidebar:
- On desktop: Click the collapse/expand button
- On mobile: Click menu icon to toggle

## Step 5: Customize

### Change Colors:
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: "hsl(217 91% 60%)", // Change this
    foreground: "hsl(210 40% 98%)",
  },
}
```

### Add New Page:
1. Create file: `src/app/(dashboard)/new-page/page.tsx`
2. Add to sidebar: `src/presentation/components/layout/sidebar.tsx`

### Connect Real API:
Update services in `src/domain/services/`:
```typescript
// src/domain/services/prediction-service.ts
async predictParkinson(recordingId: string) {
  const response = await fetch('/api/predict', {
    method: 'POST',
    body: JSON.stringify({ recordingId }),
  });
  return response.json();
}
```

## 🎨 Key Files to Customize

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Global styles, CSS variables |
| `tailwind.config.ts` | Colors, fonts, theme |
| `src/presentation/components/layout/sidebar.tsx` | Navigation items |
| `src/domain/services/*` | API integration points |
| `src/domain/models/types.ts` | Data models |

## 📱 Responsive Testing

Test on different screen sizes:
- Mobile: 375px - 640px
- Tablet: 768px - 1024px
- Desktop: 1024px+

Use browser DevTools or these shortcuts:
- Chrome: `F12` → Device Toolbar
- Firefox: `Ctrl+Shift+M`

## 🐛 Common Issues & Solutions

### Issue: Dependencies not installing
```powershell
# Clear cache and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

### Issue: Port 3000 already in use
```powershell
# Use different port
npm run dev -- -p 3001
```

### Issue: TypeScript errors
```powershell
# Check TypeScript
npm run type-check

# Or ignore for now (errors won't stop dev server)
```

### Issue: Tailwind classes not working
```powershell
# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

## 🎯 Next Steps

1. **Add Real ML Model**
   - Set up Python/FastAPI backend
   - Train or use pre-trained model
   - Connect via API

2. **Add Database**
   - PostgreSQL/MongoDB for data storage
   - Prisma ORM for type-safe queries
   - Store user recordings and results

3. **Add Authentication**
   - NextAuth.js for OAuth
   - JWT tokens
   - Protected routes

4. **Deploy**
   - Vercel (easiest): `vercel deploy`
   - Or Docker, AWS, Azure

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)

## 🤝 Need Help?

- Check `README.md` for detailed documentation
- Check `FOLDER_STRUCTURE.md` for architecture
- Review component code for implementation examples

---

**Happy Coding! 🎉**
