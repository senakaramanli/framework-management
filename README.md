# Compliance Frameworks: GDPR

A pixel-perfect UI project for managing compliance frameworks and their controls, built with Bootstrap 5, SASS, and Vanilla JavaScript. This application matches the exact design specifications from the provided screenshots.

## Features

- **Framework Management**: View and manage different compliance frameworks (Custom and System)
- **Interactive Data Tables**: Click on framework cards to view their controls with search and pagination
- **Custom Framework Creation**: Add new frameworks with a 3-step stepper modal
- **CRUD Operations**: Add, edit, and delete controls for frameworks
- **Responsive Design**: Mobile-friendly layout with Bootstrap 5
- **Pixel-Perfect Styling**: Custom SASS with BEM methodology matching the design specs

## Tech Stack

- **Frontend**: Bootstrap 5, SASS, Vanilla JavaScript
- **Build Tools**: NPM, SASS compiler, PostCSS
- **Development**: Live-server for hot reloading
- **API**: Mock JSON files for data simulation

## Project Structure

```
BK-Case/
├── public/
│   ├── index.html          # Main HTML file
│   ├── main.css           # Compiled CSS
│   ├── js/                # JavaScript modules
│   │   ├── app.js         # Main application
│   │   ├── api.js         # API layer
│   │   ├── Stepper.js     # Generic stepper component
│   │   ├── FrameworkList.js # Framework cards management
│   │   ├── DataTable.js   # Data table with search/pagination
│   │   └── modal.js       # Modal interactions
│   └── mock/              # Mock API data
│       ├── frameworks.json
│       └── controls-*.json
├── src/
│   └── scss/
│       └── main.scss      # Main SASS file
├── package.json
├── postcss.config.js
└── README.md
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   This will:
   - Compile SASS and watch for changes
   - Start live-server on http://localhost:3000
   - Automatically open the application in your browser

3. **Build for Production**
   ```bash
   npm run build
   ```
   This will:
   - Compile and minify CSS
   - Generate production-ready files

## Usage

### Framework Management
- **Custom Frameworks**: View custom frameworks with status indicators (Ready to Map, Mapping in Progress, etc.)
- **System Frameworks**: View system frameworks like GDPR, NIST CSF, ISO27001
- Click on any framework card in the left sidebar to view its controls
- The right panel will display a data table with the framework's controls

### Data Table Features
- **Search**: Use the search bar to filter controls by ID, category, or description
- **Sorting**: Click column headers to sort by Control ID or Control Category
- **Pagination**: Navigate through large datasets with configurable page sizes (10, 25, 50)
- **Responsive**: Table adapts to different screen sizes

### Creating New Frameworks
1. Click the "+ New Custom Framework 1/3" button in the header
2. **Step 1 - Framework Details**: Fill in framework details (name, short name, description, logo upload)
3. **Step 2 - Control Items**: Add controls using the inline CRUD table with + Add Control Items button
4. **Step 3 - Review & Save**: Review all details before creating the framework
5. Click "Save" to create the framework

### Stepper Component
The stepper is a reusable JavaScript class that:
- Uses data attributes for configuration (`data-step`, `data-stepper-next`, etc.)
- Validates forms before proceeding
- Supports smooth CSS transitions
- Updates progress indicators and modal titles
- Can be reused in other modals

## Design Features

### Header
- Breadcrumb navigation showing current location
- Application title with path indicators
- Help button and primary action button

### Left Sidebar
- **Custom Framework Section**: Shows custom frameworks with status badges
- **System Framework Section**: Shows system frameworks
- Framework cards with icons, names, descriptions, and status indicators
- Active framework highlighting with blue border

### Data Table
- Search functionality with real-time filtering
- Sortable columns with visual indicators
- Pagination with configurable page sizes
- Responsive design for mobile devices

### Modal System
- 3-step stepper with progress indicators
- Form validation at each step
- License banner for enterprise features
- Review step showing all entered data

## API Structure

### Frameworks Endpoint
```json
GET /mock/frameworks.json
{
  "custom": [
    {
      "id": 1,
      "name": "ECF 2023",
      "description": "Example Custom Framework",
      "status": "ready",
      "icon": "ecf"
    }
  ],
  "system": [
    {
      "id": 7,
      "name": "GDPR",
      "description": "General Data Protection Regulation",
      "status": "active",
      "icon": "gdpr"
    }
  ]
}
```

### Controls Endpoint
```json
GET /mock/controls-{id}.json
[
  {
    "id": "Article 1-0-1.1",
    "category": "Article I, Business Contact Information",
    "description": "Company and Supplier may Process the other's BCI..."
  }
]
```

## Styling

- **BEM Methodology**: All CSS classes follow BEM naming convention
- **SASS Variables**: Customizable color scheme and spacing
- **Bootstrap Overrides**: Custom styling that extends Bootstrap 5
- **Responsive Design**: Mobile-first approach with Bootstrap grid
- **Pixel-Perfect**: Matches the exact design from provided screenshots

## Status Indicators

- **Ready to Map**: Grey badge for frameworks ready for mapping
- **Mapping in Progress**: Yellow badge for active mapping
- **Ready to Publish**: Light blue badge for completed mapping
- **Mapping Failed**: Red badge for failed operations
- **Published**: Green badge for published frameworks
- **Deactivated**: Grey badge for inactive frameworks

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts
- `npm run dev` - Start development server with SASS watching
- `npm run build` - Build production files
- `npm run sass:watch` - Watch SASS files for changes
- `npm run sass:build` - Compile SASS to CSS
- `npm run serve` - Start live-server only

### Adding New Features
1. Create new JavaScript modules in `public/js/`
2. Add corresponding SASS styles in `src/scss/main.scss`
3. Update the main `app.js` to initialize new modules
4. Add mock data in `public/mock/` if needed

## License

MIT License - feel free to use this project as a starting point for your own applications.
