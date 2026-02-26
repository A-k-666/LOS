# LifeOS Project Analysis

## 📁 Project Structure & File Roles

### Core Files
- **main.tsx** - Entry point, renders App component
- **App.tsx** - Main app router, handles routes and providers
- **index.css** - Global styles, CSS variables, glass effects, gradients

### Pages
- **Index.tsx** - Redirects to /login or /today based on auth
- **Login.tsx** - Login page with OceanBackground
- **Inbox.tsx** - Capture thoughts/ideas
- **Priority.tsx** - Task management with priorities
- **TodayFocus.tsx** - Shows next best task
- **Completed.tsx** - Completed tasks history
- **NotFound.tsx** - 404 page

### Components

#### Background/Visual Effects
- **OceanBackground.tsx** - Three.js scene with:
  - 2000 animated particles (cyan color, opacity 0.6)
  - Animated wave field (wireframe mesh, opacity 0.15)
  - Uses @react-three/fiber and three.js
  - Currently at z-index -10 (HIDDEN!)

- **CursorGlow.tsx** - Mouse cursor glow effect (cyan radial gradient)
- **AnimatedButton.tsx** - Button with animations
- **StarRating.tsx** - Priority rating component

#### Layout
- **DashboardLayout.tsx** - Main layout with sidebar, navigation
- **NavLink.tsx** - Navigation link component

#### UI Components (shadcn/ui)
- 48+ UI components in `ui/` folder (buttons, dialogs, forms, etc.)

### Contexts
- **AuthContext.tsx** - Supabase authentication
- **DataContext.tsx** - Supabase database operations (inbox, tasks)

### Libraries
- **lib/supabase.ts** - Supabase client setup
- **lib/utils.ts** - Utility functions

## 🐛 Current Issues

### 1. Three.js Scene Not Visible
**Problem:** OceanBackground has `-z-10` but overlays at z-0 cover it
**Location:** DashboardLayout.tsx line 40, OceanBackground.tsx line 93

### 2. Background Image Overlay Too Heavy
**Problem:** `bg-background/60` overlay (60% opacity) covers everything
**Location:** DashboardLayout.tsx line 37

### 3. Z-Index Conflicts
Current layering:
- bg.jpg: z-index -1
- Overlay: z-index 0 (covers everything)
- OceanBackground: z-index -10 (way behind)
- Content: z-index 10

**Result:** Three.js scene completely invisible

## ✅ What Should Be Visible

1. **Three.js Scene:**
   - 2000 cyan particles floating
   - Animated wave field wireframe
   - Should be subtle background effect

2. **Background Image:**
   - bg.jpg at 40% opacity
   - Sunset ocean scene

3. **Cursor Glow:**
   - Cyan glow following mouse

4. **UI Elements:**
   - Glass panels
   - Gradient buttons
   - Animated transitions

## 🔧 Fix Needed

1. Remove heavy overlay or reduce opacity
2. Fix z-index: OceanBackground should be above bg.jpg but below content
3. Ensure Three.js scene is visible with proper opacity
