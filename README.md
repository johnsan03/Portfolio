# Software Engineer Portfolio

A modern, professional portfolio website built with React, featuring dark/light mode toggle and smooth animations.

## Features

- ✨ **Modern Design** - Clean and professional UI/UX
- 🌓 **Dark/Light Mode** - Toggle between themes with persistent storage
- 🎨 **Smooth Animations** - Powered by Framer Motion
- 📱 **Fully Responsive** - Works perfectly on all devices
- ⚡ **Fast Performance** - Built with Vite for optimal speed
- 🎯 **Sections Included**:
  - Hero section with introduction
  - About me section
  - Skills & Technologies
  - Featured Projects
  - Contact form
  - Footer

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Customization

### Update Personal Information

1. **Hero Section** (`src/components/Hero.jsx`):
   - Change name, title, and description
   - Update social media links
   - Add your profile image

2. **About Section** (`src/components/About.jsx`):
   - Update the about text
   - Modify feature cards

3. **Skills Section** (`src/components/Skills.jsx`):
   - Add/remove skills
   - Update skill levels (percentages)
   - Add new skill categories

4. **Projects Section** (`src/components/Projects.jsx`):
   - Add your projects
   - Update project descriptions
   - Add GitHub and demo links

5. **Contact Section** (`src/components/Contact.jsx`):
   - Update contact information
   - Configure form submission (currently shows alert)
   - Add your social media links

### Styling

The main styles are in `src/App.css`. The color scheme is controlled by CSS variables that change based on the theme:

- Light mode variables are defined in `:root[data-theme='light']`
- Dark mode variables are defined in `:root[data-theme='dark']`

### Theme Customization

The theme context is in `src/context/ThemeContext.jsx`. The theme preference is saved in localStorage and persists across sessions.

## Technologies Used

- **React** - UI library
- **Vite** - Build tool
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **CSS3** - Styling with CSS variables

## Project Structure

```
src/
├── components/
│   ├── Header.jsx      # Navigation header with theme toggle
│   ├── Hero.jsx        # Hero section
│   ├── About.jsx       # About section
│   ├── Skills.jsx      # Skills section
│   ├── Projects.jsx    # Projects section
│   ├── Contact.jsx     # Contact section
│   └── Footer.jsx      # Footer
├── context/
│   └── ThemeContext.jsx # Theme context provider
├── App.jsx             # Main app component
├── App.css             # Main styles
├── index.css           # Global styles
└── main.jsx            # Entry point
```

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and customize it for your own portfolio!
