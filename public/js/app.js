/**
 * Main Application - Initializes and coordinates all modules
 */
class App {
  constructor() {
    this.api = null;
    this.frameworkList = null;
    this.dataTable = null;
    this.modalManager = null;
    
    this.init();
  }

  async init() {
    try {
      // Initialize API
      this.api = new API();
      
      // Initialize modules
      this.frameworkList = new FrameworkList(null, this.api);
      
      this.dataTable = new DataTable(
        document.getElementById('controlsTable'),
        this.api
      );
      
      // Make DataTable globally accessible
      window.dataTable = this.dataTable;
      
      this.modalManager = new ModalManager();
      
      // Setup event listeners
      this.setupEventListeners();
      
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  setupEventListeners() {
    // Global event listeners can be added here
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOM loaded, initializing app...');
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing app...');
  new App();
});
