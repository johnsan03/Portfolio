# Marshal Johnsan - Software Engineer Portfolio

A modern, professional portfolio website built with React, featuring interactive games, 3D background animations, dark/light mode, and smooth scrolling. Showcasing full-stack development skills with a creative and engaging user experience.

## ✨ Features

### Core Features
- ✨ **Modern Design** - Clean, professional UI/UX with smooth animations
- 🌓 **Dark/Light Mode** - Seamless theme switching with persistent storage and smooth transitions
- 🎨 **Smooth Animations** - Powered by Framer Motion with scroll-triggered effects
- 📱 **Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- ⚡ **Fast Performance** - Built with Vite for optimal speed and bundle size
- 🎮 **Interactive Games** - Three fun developer challenges (no backend required)
- 🎭 **3D Background** - Dynamic particle system with interactive 3D shapes (full-page effect)
- 🖼️ **Theme-Based Images** - Profile images that change based on theme with smooth transitions
- 📜 **Single Page Scroll** - Continuous scrolling without internal scroll containers
- 📊 **Visitor Tracking** - Backend-powered visitor and likes counter with unique visitor tracking

### Sections Included
- **Hero Section** - Introduction with animated profile image and social links
- **About Section** - Personal background and experience
- **Skills Section** - Technical skills with progress indicators
- **Education Section** - Timeline of educational background
- **Quotes Section** - Random developer and fun quotes with toggle
- **Developer Challenges** - Interactive games (Typing, Memory Match, Bug Hunter)
- **Projects Section** - Featured projects with links and descriptions
- **Contact Section** - Contact information and social media links
- **Visit Counter** - Visitor statistics and likes counter
- **Footer** - Additional links and copyright

## 🎮 Interactive Games

The portfolio includes three engaging games that showcase creativity:

1. **Code Typing Challenge** - Test your typing speed with code snippets
   - Real-time WPM and accuracy tracking
   - 60-second timer
   - Color-coded feedback system
   - Score tracking

2. **Memory Match** - Match pairs of tech stack cards
   - 3D flip animations
   - Move counter
   - Completion celebration
   - Tech stack themed (React, Node, Python, Java, MongoDB, PostgreSQL, Docker, AWS)

3. **Bug Hunter** - Click bugs (errors) before they escape
   - 30-second timer
   - Animated bugs with rotation effects
   - Score and missed count tracking
   - Increasing difficulty

## 🗄️ Visitor Tracking & Likes

The portfolio uses a **Xano backend** for visitor tracking and likes management. All data is stored securely in the backend database.

### How It Works

- **Visitor Tracking**: Tracks unique visitors and total visits
  - Each visitor gets a unique ID stored in browser localStorage
  - Visit data is stored in the backend database
  - Tracks last visit timestamp for each visitor

- **Likes System**: Backend-managed likes with one like per visitor
  - Each unique visitor can like only once
  - Like status is checked against the backend database
  - Total likes are displayed from the database

### Setup Instructions

1. **Configure Environment Variable**:
   
   Create or update `.env` file in the project root:
   ```env
   VITE_API_KEY=your-api-key-here
   ```
   
   Replace `your-api-key-here` with your Xano API key (if required by your backend)

2. **Backend Configuration**:
   
   The backend API base URL is configured in `src/utils/counterDB.js`:
   ```javascript
   const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:WpZv-jLF';
   ```
   
   Update this if your backend URL changes.

3. **Backend Endpoints Required**:
   - `GET /counter` - Get all counter records
   - `POST /counter` - Add a new like
   - `GET /visitor` - Get all visitor records
   - `POST /visitor` - Record a new visit
   - `GET /visitor/{visitor_id}` - Get visitor by ID

4. **That's It!** 🎉
   - Visitor tracking starts automatically on page load
   - Likes are managed through the backend API
   - All data persists in the database

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Portfolio
```

2. Install dependencies:
```bash
npm install
```

3. **Configure Backend API** (see Visitor Tracking & Likes section above):
   - Create a `.env` file with your API key (if required)

4. **Start the Frontend**:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

**Note**: The visit counter and likes require a working backend connection. Make sure your backend API is accessible and properly configured.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Deploy using GitHub Pages or your preferred hosting service.

## 🎨 Customization

### Update Personal Information

1. **Hero Section** (`src/components/Hero.jsx`):
   - Change name, title, and description
   - Update social media links (GitHub, LinkedIn, Email)
   - Add profile images (Light.png and Dark.png in assets folder)
   - Update resume PDF link

2. **About Section** (`src/components/About.jsx`):
   - Update the about text
   - Modify experience years
   - Update specialized technologies

3. **Skills Section** (`src/components/Skills.jsx`):
   - Add/remove skills
   - Update skill categories
   - Modify skill icons

4. **Education Section** (`src/components/Education.jsx`):
   - Update education history
   - Add/remove education entries
   - Modify courses and descriptions

5. **Projects Section** (`src/components/Projects.jsx`):
   - Add your projects
   - Update project descriptions
   - Add GitHub and demo links
   - Update technologies used

6. **Contact Section** (`src/components/Contact.jsx`):
   - Update contact information (email, phone, location)
   - Configure form submission
   - Add your social media links

7. **Quotes Section** (`src/components/Quotes.jsx`):
   - Customize quote lists
   - Add your own quotes
   - Modify quote categories

8. **Games Section** (`src/components/Games.jsx`):
   - Customize game rules and mechanics
   - Add new games
   - Modify game styling

### Profile Images

The portfolio supports theme-based profile images:
- Place `Light.png` in `src/assets/` for light mode
- Place `Dark.png` in `src/assets/` for dark mode
- Images automatically switch based on the current theme with smooth flip animations

### Styling

The main styles are in `src/App.css`. The color scheme is controlled by CSS variables that change based on the theme:

- Light mode variables are defined in `:root[data-theme='light']`
- Dark mode variables are defined in `:root[data-theme='dark']`
- Default fallback in `src/index.css`

### Theme Customization

The theme context is in `src/context/ThemeContext.jsx`. The theme preference is saved in localStorage and persists across sessions. The theme is applied immediately on page load to prevent flash of unstyled content (FOUC).

### 3D Background

The 3D background animation is in `src/components/Background3D.jsx`. This is the **only** 3D effect on the page - individual components use simple 2D transforms for better scroll performance. You can customize:
- Particle count and colors
- Shape types and animations (cubes, spheres, rings)
- Mouse interaction sensitivity
- Animation speed and depth
- Connection mesh network

**Note:** The 3D background is optimized to not cause scroll issues. All sections have proper overflow handling to contain the background animation.

## 🛠️ Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library for smooth transitions
- **React Icons** - Icon library (Font Awesome)
- **CSS3** - Advanced styling with CSS variables and animations
- **Canvas API** - For 3D background animations
- **Xano Backend** - RESTful API for visitor tracking and likes management

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation header with theme toggle
│   ├── Hero.jsx           # Hero section with profile image
│   ├── About.jsx          # About section
│   ├── Skills.jsx         # Skills section
│   ├── Education.jsx       # Education timeline
│   ├── Quotes.jsx         # Quotes section
│   ├── Games.jsx          # Interactive games section
│   ├── Projects.jsx       # Projects section
│   ├── Contact.jsx        # Contact section
│   ├── Footer.jsx         # Footer
│   ├── VisitCounter.jsx   # Visitor tracking and likes component
│   └── Background3D.jsx   # 3D background animation
├── context/
│   └── ThemeContext.jsx    # Theme context provider
├── utils/
│   └── counterDB.js        # Backend API utilities for visitor tracking and likes
├── assets/
│   ├── Light.png          # Light mode profile image
│   ├── Dark.png           # Dark mode profile image
│   └── [Resume].pdf       # Resume PDF
├── App.jsx                # Main app component
├── App.css                # Main styles
├── index.css              # Global styles
└── main.jsx               # Entry point
```

## 🎯 Key Features Explained

### Theme System
- Persistent theme storage using localStorage
- System preference detection
- Smooth theme transitions with profile image flip animation
- Cross-browser compatibility
- No flash of unstyled content (FOUC)
- Immediate theme application on page load

### 3D Background
- **Full-page 3D effect** - Only the background uses 3D transforms
- Interactive particle system with depth management
- 3D geometric shapes (cubes, spheres, rings)
- Mouse interaction for dynamic movement
- Mesh network connections between particles
- Optimized performance with proper bounds checking
- **No scroll interference** - All sections have overflow handling

### Animations
- Scroll-triggered animations using Framer Motion
- Simple 2D hover effects (no 3D transforms on components)
- Entrance animations for sections
- Theme transition animations with profile image flip
- Smooth page transitions
- Optimized for scroll performance

### Scroll Performance
- **Single continuous page scroll** - No internal scroll containers
- All sections have proper overflow handling
- 3D background contained within viewport
- No scroll jank or awkward behavior
- Smooth scrolling across all devices
- Optimized for mobile and desktop

### Responsive Design
- Mobile-first approach
- Breakpoints for various screen sizes (1200px, 968px, 768px, 640px, 480px)
- Touch-friendly interactions
- Optimized layouts for all devices
- Landscape orientation support

## 📝 Notes

- All games run entirely client-side (no backend required)
- Profile images should be optimized for web (recommended: 300x300px or larger)
- Resume PDF should be placed in the assets folder
- The portfolio is optimized for GitHub Pages deployment
- **3D effects are only on the background** - Individual components use simple 2D transforms for better performance
- All sections have overflow protection to prevent scroll issues
- Visitor tracking and likes require a working backend API connection
- API requests are cached and rate-limited to prevent excessive calls

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

### Performance Optimizations

- Removed 3D transforms from individual components
- Optimized 3D background with proper depth management
- Smooth scrolling with overflow handling
- Efficient canvas rendering
- Optimized animations for 60fps

## 🐛 Known Issues & Solutions

### Scroll Issues
- **Fixed:** All sections now have `overflow: hidden` to prevent 3D background overflow
- **Fixed:** Containers have `overflow: visible` for content flow
- **Fixed:** 3D background canvas is strictly bounded to viewport

### Theme Issues
- **Fixed:** Theme applies immediately on page load (no FOUC)
- **Fixed:** Cross-browser compatibility with proper initialization
- **Fixed:** Profile images switch smoothly with flip animation

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio! If you find any bugs or have suggestions, please open an issue.

## 👤 Author

**Marshal Johnsan**
- GitHub: [@johnsan03](https://github.com/johnsan03)
- LinkedIn: [Johnsan Marshal](https://www.linkedin.com/in/johnsan-marshal-a1307535a/)
- Email: john10mar28@gmail.com

## 🙏 Acknowledgments

- Framer Motion for amazing animation capabilities
- React Icons for comprehensive icon library
- All the developers who inspired this portfolio design

---

Made with ❤️ using React and modern web technologies
