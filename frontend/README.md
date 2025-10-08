# 🎨 Frontend - HomeLand Real Estate

React-based frontend application for the HomeLand real estate platform.

---

## 📋 Tech Stack

### Core
- **React 18.1.0** - UI framework
- **React Router DOM 6.30.1** - Client-side routing
- **Framer Motion 12.23.19** - Animations & transitions

### Styling
- **Tailwind CSS 3.0.24** - Utility-first CSS
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### UI Libraries
- **Material-UI (MUI) 7.3.2** - Component library
  - @mui/material - Core components
  - @mui/icons-material - Icon library
  - @mui/x-data-grid - Data grid for admin
- **@emotion/react & @emotion/styled** - CSS-in-JS
- **React Icons 4.12.0** - Icon library
- **Lucide React 0.544.0** - Modern icon set
- **@headlessui/react 1.6.4** - Unstyled accessible components

### Charts & Visualization
- **Recharts 3.2.1** - Chart library for dashboard

### Development
- **React Scripts 5.0.1** - Build tooling
- **Concurrently 9.2.1** - Run multiple commands

---

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
│   ├── index.html            # HTML template
│   └── assets/               # Images, icons
│       └── img/              # Property images
├── src/
│   ├── App.js                # Main app component
│   ├── index.js              # Entry point
│   ├── index.css             # Global styles
│   ├── components/           # Reusable components
│   │   ├── Banner.js         # Hero banner
│   │   ├── ChatbotPopup.js   # AI chatbot UI
│   │   ├── CountryDropdown.js
│   │   ├── FavoritesContext.js
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── House.js          # House card component
│   │   ├── HouseContext.js   # House state management
│   │   ├── HouseList.js
│   │   ├── PriceRangeDropdown.js
│   │   ├── PropertyDropdown.js
│   │   ├── ScrollToTop.js
│   │   ├── Search.js
│   │   └── Toast.js          # Toast notifications
│   ├── pages/                # Page components
│   │   ├── Home.js
│   │   ├── PropertyDetails.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Profile.js
│   │   ├── Favorites.js
│   │   └── admin/            # Admin pages
│   │       ├── Dashboard.js
│   │       ├── Users.js
│   │       ├── Houses.js
│   │       ├── Bookings.js
│   │       └── login.js
│   ├── layouts/
│   │   └── AdminLayout.js    # Admin layout wrapper
│   ├── routes/
│   │   └── PrivateAdminRoute.js
│   ├── services/
│   │   └── api.js            # API service layer
│   └── data.js               # Static data (fallback)
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
└── postcss.config.js         # PostCSS configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
# Run frontend only
npm start

# Build for production
npm run build

# Run tests
npm test
```

The app will open at `http://localhost:3000`

---

## 🎨 Styling System

### Tailwind Configuration

**Custom Colors:**
- `primary`: #101828 (Dark)
- `secondary`: #7F56D9 (Purple)

**Custom Screens:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1234px

**Custom Shadows:**
- `shadow-1`: 0px 4px 30px rgba(0, 0, 0, 0.08)

### Global Styles

**Custom CSS Classes:**
- `.dropdown` - Dropdown container
- `.dropdown-btn` - Dropdown button
- `.dropdown-icon-primary` - Primary icon
- `.dropdown-icon-secondary` - Secondary icon
- `.dropdown-menu` - Dropdown menu
- `.btn-ripple` - Button with ripple effect
- `.skeleton` - Loading skeleton
- `.page-transition` - Page transition animation

**Custom Animations:**
- `fadeIn` - Fade in animation
- `slideUp` - Slide up animation
- `shimmer` - Skeleton loading animation
- `ripple` - Button ripple effect

**Custom Scrollbar:**
- Purple gradient scrollbar
- Smooth hover effects

---

## 🧩 Components

### Core Components

#### 1. **Header.js**
- Navigation bar
- User authentication status
- Links to pages
- Responsive mobile menu

#### 2. **Footer.js**
- Company information
- Social links
- Copyright notice

#### 3. **Banner.js**
- Hero section
- Call-to-action
- Background image

#### 4. **Search.js**
- Property search form
- Filters: type, country, price range
- Integration with HouseContext

#### 5. **House.js**
- Property card component
- Image, price, details
- Favorite button
- Link to details page

#### 6. **HouseList.js**
- Grid of house cards
- Loading states
- Empty states

#### 7. **ChatbotPopup.js**
- AI chatbot interface
- Message history
- House card display
- Integration with Python AI backend
- Fallback to JavaScript mode

#### 8. **Toast.js**
- Toast notification system
- Success/error messages
- Auto-dismiss

### Dropdowns

#### 1. **PropertyDropdown.js**
- Property type filter
- Options: House, Apartment, All

#### 2. **CountryDropdown.js**
- Country filter
- Options: All countries, specific countries

#### 3. **PriceRangeDropdown.js**
- Price range filter
- Predefined ranges

---

## 📄 Pages

### User Pages

#### 1. **Home.js**
- Landing page
- Banner + Search + HouseList

#### 2. **PropertyDetails.js**
- Detailed property view
- Image gallery
- Property information
- Agent details
- Booking form

#### 3. **Login.js**
- User login form
- Email + password
- Redirect to profile

#### 4. **Signup.js**
- User registration
- Username, email, password
- Validation

#### 5. **Profile.js**
- User information
- Edit profile
- Change password
- Logout

#### 6. **Favorites.js**
- Saved properties
- Remove from favorites
- Navigate to details

### Admin Pages

#### 1. **Dashboard.js**
- Statistics overview
- Charts (Recharts)
- Recent activities
- Quick actions

#### 2. **Users.js**
- User management table
- CRUD operations
- Search & filter
- MUI DataGrid

#### 3. **Houses.js**
- Property management
- Add/Edit/Delete houses
- Image upload
- Status management

#### 4. **Bookings.js**
- Booking management
- Approve/Reject bookings
- View booking details

#### 5. **login.js**
- Admin login
- Username + password
- Separate from user login

---

## 🔄 State Management

### Context API

#### 1. **HouseContext.js**
- Houses data
- Filters (type, country, price)
- Search functionality
- Loading states

#### 2. **FavoritesContext.js**
- Favorite houses
- Add/Remove favorites
- Persist to localStorage

#### 3. **ToastProvider**
- Toast notifications
- Show success/error messages

---

## 🎬 Animations

### Framer Motion

**Page Transitions:**
```javascript
const pageVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};
```

**Features:**
- Smooth page transitions
- Scroll restoration
- Route-based animations
- Component animations

---

## 🛣️ Routing

### User Routes
- `/` - Home
- `/property/:id` - Property details
- `/login` - User login
- `/signup` - User signup
- `/profile` - User profile
- `/favorites` - Favorite properties

### Admin Routes (Protected)
- `/admin/login` - Admin login
- `/admin` - Dashboard
- `/admin/users` - User management
- `/admin/houses` - House management
- `/admin/bookings` - Booking management

### Route Protection
- `PrivateAdminRoute.js` - Protects admin routes
- Redirects to login if not authenticated

---

## 🔌 API Integration

### API Service (`services/api.js`)

**Base URL:** `http://localhost:5000/api`

**Endpoints:**
- `GET /houses` - Get all houses
- `GET /houses/:id` - Get house by ID
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `POST /auth/admin-login` - Admin login
- `GET /users` - Get all users (admin)
- `POST /houses` - Create house (admin)
- `PUT /houses/:id` - Update house (admin)
- `DELETE /houses/:id` - Delete house (admin)
- `GET /bookings` - Get bookings (admin)
- `POST /bookings` - Create booking

### AI Chatbot API

**Base URL:** `http://localhost:5001`

**Endpoints:**
- `POST /chat` - Send message to AI
- `GET /health` - Check AI status

**Fallback:**
If Python backend is down, chatbot uses JavaScript fallback mode with regex patterns.

---

## 🎯 Features

### 1. **Property Search**
- Filter by type, country, price
- Real-time search
- Responsive results

### 2. **Favorites System**
- Save favorite properties
- Persist to localStorage
- Heart icon toggle
- Favorites page

### 3. **AI Chatbot**
- Natural language understanding
- Property recommendations
- Click house cards to navigate
- Multilingual (Vietnamese + English)

### 4. **User Authentication**
- Login/Signup
- Profile management
- Session persistence

### 5. **Admin Dashboard**
- Statistics & charts
- User management
- House management
- Booking management
- MUI DataGrid tables

### 6. **Responsive Design**
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly UI

### 7. **Animations**
- Page transitions
- Component animations
- Loading skeletons
- Smooth scrolling

---

## 🛠️ Development Guide

### Adding a New Component

1. Create file in `src/components/`
2. Import in parent component
3. Use Tailwind for styling
4. Add PropTypes if needed

### Adding a New Page

1. Create file in `src/pages/`
2. Add route in `App.js`
3. Add navigation link in `Header.js`

### Styling Guidelines

- Use Tailwind utility classes
- Follow existing color scheme
- Use custom classes from `index.css`
- Maintain responsive design

### State Management

- Use Context API for global state
- Use local state for component-specific data
- Avoid prop drilling

---

## 🔧 Configuration Files

### package.json
- Dependencies
- Scripts
- ESLint config
- Browserslist

### tailwind.config.js
- Custom theme
- Colors, fonts, screens
- Plugins

### postcss.config.js
- Tailwind CSS
- Autoprefixer

---

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

Creates optimized build in `/build` folder.

### Deployment Options

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

**Environment Variables:**
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_AI_API_URL` - AI Backend URL

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

**Testing Libraries:**
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module not found
```bash
npm install
```

### Build errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Material-UI](https://mui.com)
- [React Router](https://reactrouter.com)

---

**Built with ❤️ using React & Tailwind CSS**
