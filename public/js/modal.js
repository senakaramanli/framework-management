class ModalManager {
  constructor() {
    this.modal = null;
    this.stepper = null;
    this.init();
  }

  init() {
    console.log("ModalManager init called");
    this.modal = document.getElementById('newFrameworkModal');
    if (this.modal) {
      console.log("Modal element found");
      this.modal.addEventListener('show.bs.modal', () => {
        console.log("Bootstrap modal show event triggered");
        this.onFrameworkModalShow();
      });
    } else {
      console.log("Modal element not found!");
    }
    
    // Setup direct modal handler
    this.setupDirectModalHandler();
  }

  onFrameworkModalShow() {
    console.log("Modal show event triggered");
    
    // Initialize stepper - use the correct selector
    const stepperContainer = document.querySelector('.stepper') || document.getElementById('frameworkStepper');
    console.log("Stepper container found:", stepperContainer);
    
    if (stepperContainer) {
      console.log("Initializing stepper...");
      this.stepper = new Stepper(stepperContainer);
      console.log("Stepper initialized:", this.stepper);
    } else {
      console.log("Stepper container not found");
    }

    // Setup file upload
    this.setupFileUpload();
  }

  // File upload handler
  setupFileUpload() {
    console.log("Setting up file upload");
    const fileInput = document.getElementById('templateFile');
    const fileNameSpan = document.getElementById('fileName');
    
    console.log("File input found:", fileInput);
    console.log("File name span found:", fileNameSpan);
    
    if (fileInput && fileNameSpan) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          fileNameSpan.textContent = file.name;
          fileNameSpan.style.color = '#28a745';
          console.log("File selected:", file.name);
        } else {
          fileNameSpan.textContent = 'No file selected';
          fileNameSpan.style.color = '#6c757d';
        }
      });
    }
  }

  // Direct modal button handler
  setupDirectModalHandler() {
    console.log("Setting up direct modal handler");
    const newFrameworkBtn = document.querySelector('[data-bs-target="#newFrameworkModal"]');
    console.log("New framework button found:", newFrameworkBtn);
    
    if (newFrameworkBtn) {
      newFrameworkBtn.addEventListener('click', () => {
        console.log("Direct modal button clicked");
        setTimeout(() => {
          this.onFrameworkModalShow();
        }, 100);
      });
    }
  }
}

// Export for use in other modules
window.ModalManager = ModalManager;
