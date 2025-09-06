# Compliance Frameworks UI

A pixel-perfect compliance frameworks management interface built with Bootstrap 5, SASS, and Vanilla JavaScript.

## Features

- **Framework List**: Interactive sidebar with framework cards and status badges
- **Data Table**: Paginated controls table with search, sorting, and actions
- **Modal Stepper**: Generic stepper component with form validation
- **Responsive Design**: Mobile-friendly layout with Bootstrap 5 grid
- **Mock API**: Built-in mock data for development and testing

## Technology Stack

- **Bootstrap 5**: UI framework and components
- **SASS/SCSS**: CSS preprocessing with variables and mixins
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **Bootstrap Icons**: Icon library
- **Lite Server**: Development server

## Project Structure

```
├── public/
│   ├── index.html          # Main HTML file
│   ├── main.css           # Compiled CSS (generated)
│   ├── js/                # JavaScript modules
│   │   ├── app.js         # Main application
│   │   ├── api.js         # API and mock data
│   │   ├── Stepper.js     # Generic stepper component
│   │   ├── FrameworkList.js # Sidebar framework list
│   │   ├── DataTable.js   # Data table component
│   │   ├── modal.js       # Modal management
│   │   └── validation.js  # Form validation
│   └── assets/icons/      # Framework icons
├── src/scss/              # SASS source files
│   ├── main.scss         # Main SASS file
│   ├── _variables.scss   # Design tokens and variables
│   ├── _mixins.scss      # Reusable mixins
│   ├── base/             # Base styles
│   ├── layout/           # Layout components
│   ├── components/       # UI components
│   └── utilities/        # Utility classes
└── package.json          # Dependencies and scripts
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd compliance-frameworks-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run start
   ```
   This will start both the SASS watcher and the development server.

## Available Scripts

- `npm run dev` - Watch SASS files and compile CSS
- `npm run build:css` - Build compressed CSS
- `npm run serve` - Start development server
- `npm run start` - Start both SASS watcher and server

## Usage

### Framework Selection
- Click on framework cards in the left sidebar to view their controls
- Each framework shows its status with color-coded badges
- The data table will load controls for the selected framework

### Data Table Features
- **Search**: Use the search box to filter controls
- **Pagination**: Navigate through pages of controls
- **Sorting**: Click column headers to sort data
- **Actions**: Edit, approve, or delete controls using action buttons

### New Framework Modal
- Click "New Custom Framework" to open the modal
- **Step 1**: Fill in framework details (Name and Short Name are required)
- **Step 2**: Add control items to the framework
- Form validation prevents progression with invalid data

### Keyboard Shortcuts
- `Ctrl/Cmd + N`: Open new framework modal
- `Ctrl/Cmd + H`: Show help
- `Escape`: Close modal
- `Arrow Keys`: Navigate stepper steps (when modal is open)

## Design System

### Colors
- **Primary**: #3DCC77 (Green - Ready to Map/CTA)
- **Info**: #60a5fa (Blue - Ready to Map/Publish)
- **Warning**: #f59e0b (Orange - Mapping in Progress)
- **Danger**: #ef4444 (Red - Failed)
- **Muted**: #94a3b8 (Gray - Muted states)

### Typography
- **Font Family**: Inter, system fonts
- **Base Size**: 0.875rem (14px)
- **Line Height**: 1.5

### Spacing
- **Base Unit**: 1rem (16px)
- **Border Radius**: 16px for cards, 8px for inputs
- **Shadows**: Subtle card shadows for depth

## Component Architecture

### Stepper Component
The stepper is a generic, reusable component that uses a state machine approach:
- No show/hide functions - only CSS-based visibility
- Data attributes control step visibility
- Guard functions prevent invalid step transitions
- Keyboard navigation support

### API Module
- Handles both real API calls and mock data fallback
- 200ms delay simulation for realistic UX
- Comprehensive mock data for all frameworks and controls

### Validation System
- Real-time form validation
- Bootstrap 5 validation integration
- Custom validation rules for framework creation
- Guard functions for stepper navigation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Adding New Components
1. Create SASS file in `src/scss/components/`
2. Import in `src/scss/main.scss`
3. Create JavaScript module in `public/js/`
4. Initialize in `public/js/app.js`

### Customizing Styles
- Modify design tokens in `src/scss/_variables.scss`
- Add new mixins in `src/scss/_mixins.scss`
- Use utility classes from `src/scss/utilities/_utilities.scss`

## License

MIT License - see LICENSE file for details.
