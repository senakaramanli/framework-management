/**
 * Main Application
 * Bootstraps the compliance frameworks UI
 */

class App {
  constructor() {
    this.frameworkList = null;
    this.dataTable = null;
    this.modalManager = null;

    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.bootstrap());
    } else {
      this.bootstrap();
    }
  }

  bootstrap() {
    this.initializeComponents();
    this.bindGlobalEvents();

  }

  initializeComponents() {
    this.frameworkList = new FrameworkList("frameworkListContainer");

    this.dataTable = new DataTable("dataTable");

    if (modalManager) {
      modalManager.setFrameworkList(this.frameworkList);
      console.log("Modal manager connected to framework list");
    }

    this.frameworkList.setOnFrameworkSelect((framework) => {
      this.onFrameworkSelected(framework);
    });
  }

  bindGlobalEvents() {
    const newFrameworkBtn = document.getElementById("newFrameworkButton");
    if (newFrameworkBtn) {
      newFrameworkBtn.addEventListener("click", () => {
        this.openNewFrameworkModal();
      });
    }

    const helpBtn = document.getElementById("helpButton");

    document.addEventListener("keydown", (e) => this.handleGlobalKeydown(e));
  }

  onFrameworkSelected(framework) {
    this.updateHeaderTitle(framework.name);

    this.dataTable.showLoading();
    this.dataTable.initTable(framework.id, 1, 10);
  }

  updateHeaderTitle(frameworkName) {
    const headerTitle = document.getElementById("headerFrameworkTitle");
    if (headerTitle) {
      headerTitle.textContent = `Compliance Frameworks: ${frameworkName}`;
    }
  }

  openNewFrameworkModal() {
    if (modalManager) {
      modalManager.open();
    }
  }

  handleGlobalKeydown(event) {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;

    if (isCtrlOrCmd) {
      switch (event.key.toLowerCase()) {
        case "n":
          event.preventDefault();
          this.openNewFrameworkModal();
          break;
        case "h":
          event.preventDefault();
          break;
      }
    }

    // Handle Escape key
    if (event.key === "Escape") {
      // Close any open modals
      const openModal = document.querySelector(".modal.show");
      if (openModal) {
        const modal = bootstrap.Modal.getInstance(openModal);
        if (modal) {
          modal.hide();
        }
      }
    }
  }

  // Public API methods
  refreshFrameworkList() {
    if (this.frameworkList) {
      this.frameworkList.refresh();
    }
  }

  refreshDataTable() {
    if (this.dataTable) {
      this.dataTable.refresh();
    }
  }

  getSelectedFramework() {
    return this.frameworkList
      ? this.frameworkList.getSelectedFramework()
      : null;
  }

  // Error handling
  handleError(error, context = "Unknown") {
    console.error(`Error in ${context}:`, error);

    // Show user-friendly error message
    const errorMessage = `An error occurred: ${
      error.message || "Unknown error"
    }`;
    alert(errorMessage);
  }

  // Cleanup
  destroy() {
    if (this.frameworkList) {
      this.frameworkList.destroy();
    }

    if (this.dataTable) {
      this.dataTable.destroy();
    }

    // Remove global event listeners
    document.removeEventListener("keydown", this.handleGlobalKeydown);
  }
}

// Initialize the application
const app = new App();

// Make app globally available for debugging
window.app = app;

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = App;
}
