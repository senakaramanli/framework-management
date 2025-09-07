# Compliance Frameworks UI

A pixel-perfect compliance frameworks management interface built with Bootstrap 5, SASS, and Vanilla JavaScript.

## Features

- **Framework List**: Interactive sidebar with framework cards and status badges
- **Data Table**: Paginated controls table with search, sorting, and actions
- **Modal Stepper**: Generic stepper component with form validation
- **Responsive Design**: Mobile-friendly layout
- **Mock API**: Built-in mock data for development

## Technology Stack

- **Bootstrap 5**: UI framework and components
- **SASS/SCSS**: CSS preprocessing
- **Vanilla JavaScript**: Pure ES6+ JavaScript
- **Bootstrap Icons**: Icon library
- **Lite Server**: Development server

## Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd BK-Case
   npm install
   ```

2. **Start development server**
   ```bash
   npm run start
   ```

## Available Scripts

- `npm run start` - Start SASS watcher and development server
- `npm run dev` - Watch SASS files and compile CSS
- `npm run build:css` - Build compressed CSS
- `npm run serve` - Start development server only

## Usage

### Framework Selection
- Click framework cards in the left sidebar to view controls
- Each framework shows status with color-coded badges and icons
- Active framework shows a white notch indicator

### Data Table
- **Search**: Filter controls with search box
- **Sorting**: Click column headers to sort (Control ID and Category)
- **Pagination**: Navigate through pages
- **Actions**: Edit, approve, or delete controls

### New Framework Modal
- Click "New Custom Framework" to open modal
- **Step 1**: Fill framework details (Name and Short Name required)
- **Step 2**: Add control items
- Form validation prevents invalid progression

## Design System

### Colors
- **Background**: #eff0f3
- **Card Background**: #ffffff
- **Primary**: #3DCC77 (Green)
- **Info**: #60a5fa (Blue)
- **Warning**: #f59e0b (Orange)
- **Danger**: #ef4444 (Red)
- **Ready to Map**: #8B5CF6 (Purple)

### Layout
- **Sidebar Width**: 480px fixed
- **Responsive**: Mobile-friendly with column layout
- **Typography**: Inter font family, 14px base size

## Project Structure

```
├── public/
│   ├── index.html          # Main HTML
│   ├── main.scss          # SASS source
│   ├── main.css           # Compiled CSS
│   ├── js/                # JavaScript modules
│   │   ├── app.js         # Main application
│   │   ├── api.js         # API and mock data
│   │   ├── Stepper.js     # Stepper component
│   │   ├── FrameworkList.js # Framework list
│   │   ├── DataTable.js   # Data table
│   │   ├── modal.js       # Modal management
│   │   ├── Header.js      # Header component
│   │   └── validation.js  # Form validation
│   ├── assets/icons/      # Icons
│   └── mock/              # Mock data
└── package.json           # Dependencies
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License
