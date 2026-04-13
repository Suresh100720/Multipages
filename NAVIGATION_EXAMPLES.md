# Page Navigation Examples

This project demonstrates two different approaches for page navigation:

## 1. Router-Based Navigation (Current Implementation)
**Location:** `src/App.jsx` and `src/routes/AppRoutes.jsx`

**How it works:**
- Uses React Router (`react-router-dom`)
- URLs change based on the page (e.g., `/`, `/candidates`, `/jobs`)
- Navigation through `<Link>` components
- Better for SEO and browser history

**Advantages:**
- ✅ Browser back/forward buttons work
- ✅ Shareable URLs
- ✅ Bookmarkable pages
- ✅ Better SEO
- ✅ Native browser features

**Current Pages:**
- Dashboard (`/`)
- Candidates (`/candidates`)
- Jobs (`/jobs`)

---

## 2. State-Based Navigation (Example Implementation)
**Location:** `src/examples/AppWithStateNavigation.jsx`

**How it works:**
- Uses React state (`useState`) to manage current page
- No URL changes
- All pages rendered through conditional logic
- Page components switch based on state value

**Advantages:**
- ✅ Simpler setup (no routing library needed)
- ✅ Faster transitions (no router overhead)
- ✅ Good for single-page applications
- ✅ Better for modal/panel-based apps
- ✅ Easier state sharing between pages

**Limitations:**
- ❌ No URL changes (can't bookmark)
- ❌ Browser history doesn't work
- ❌ All JavaScript runs at once (no code splitting)
- ❌ Not ideal for SEO

---

## Example: Settings Page (State-Based)
**Location:** `src/pages/Settings/Settings.jsx`

The Settings page demonstrates a non-routed page with:
- Local state management (`useState`)
- Form handling (toggles, selects, inputs)
- Unsaved changes detection
- Ant Design components (Card, Switch, Select, Input)
- Theme support (dark/light mode)

**Features:**
- Notifications settings
- Preferences (language, timezone)
- Security settings
- Save/Reset functionality

To add Settings to your router, update `src/routes/AppRoutes.jsx`:

```jsx
import Settings from "../pages/Settings/Settings";

// Add to routes array:
{ path: "/settings", element: <Settings darkMode={darkMode} /> }
```

---

## How to Use State-Based Navigation

### Step 1: Create a wrapper component
```jsx
const [currentPage, setCurrentPage] = useState("dashboard");

const pageMap = {
  dashboard: <Dashboard />,
  settings: <Settings />,
};

return pageMap[currentPage];
```

### Step 2: Update navigation to use state
```jsx
<button onClick={() => setCurrentPage("settings")}>
  Settings
</button>
```

### Step 3: Pass page state to components
```jsx
<SidebarWithState 
  currentPage={currentPage} 
  onPageChange={setCurrentPage} 
/>
```

---

## Which Approach to Use?

**Use Router (Current Setup) when:**
- ✅ You need bookmarkable URLs
- ✅ You want browser history to work
- ✅ You need multiple independent pages
- ✅ You want SEO support

**Use State-Based Navigation when:**
- ✅ Building a dashboard or admin panel
- ✅ Pages are highly interconnected
- ✅ You want instant transitions
- ✅ You don't need URL history

---

## File Structure
```
src/
├── App.jsx (Router-based - current)
├── examples/
│   └── AppWithStateNavigation.jsx (State-based example)
├── pages/
│   ├── Dashboard/
│   ├── Candidates/
│   ├── Jobs/
│   └── Settings/ (New page example)
└── routes/
    └── AppRoutes.jsx
```

---

## To Switch to State-Based Navigation
Replace `App.jsx` export with:
```jsx
export default AppWithStateNavigation;
```

Then add Settings to the navigation menu in `SidebarWithState`.
