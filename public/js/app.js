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
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bootstrap());
        } else {
            this.bootstrap();
        }
    }
    
    bootstrap() {
        this.initializeComponents();
        this.bindGlobalEvents();
        
        console.log('Compliance Frameworks UI initialized');
    }
    
    initializeComponents() {
        // Initialize Framework List
        this.frameworkList = new FrameworkList('frameworkListContainer');
        
        // Initialize Data Table
        this.dataTable = new DataTable('dataTable');
        
        // Set up modal manager with framework list reference
        if (modalManager) {
            modalManager.setFrameworkList(this.frameworkList);
            console.log('Modal manager connected to framework list');
        }
        
        // Set up framework selection callback
        this.frameworkList.setOnFrameworkSelect((framework) => {
            this.onFrameworkSelected(framework);
        });
    }
    
    bindGlobalEvents() {
        // New Framework button
        const newFrameworkBtn = document.getElementById('newFrameworkButton');
        if (newFrameworkBtn) {
            newFrameworkBtn.addEventListener('click', () => {
                this.openNewFrameworkModal();
            });
        }
        
        // Help button
        const helpBtn = document.getElementById('helpButton');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelp();
            });
        }
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
    }
    
    onFrameworkSelected(framework) {
        console.log('Framework selected:', framework);
        
        // Update header title
        this.updateHeaderTitle(framework.name);
        
        // Initialize data table with framework data
        this.dataTable.initTable(framework.id, 1, 10);
    }
    
    updateHeaderTitle(frameworkName) {
        const headerTitle = document.getElementById('headerFrameworkTitle');
        if (headerTitle) {
            headerTitle.textContent = `Compliance Frameworks - ${frameworkName}`;
        }
    }
    
    openNewFrameworkModal() {
        if (modalManager) {
            modalManager.open();
        }
    }
    
    showHelp() {
        alert(`Compliance Frameworks UI Help

Keyboard Shortcuts:
• Ctrl/Cmd + N: New Framework
• Ctrl/Cmd + H: Help
• Escape: Close modal
• Arrow keys: Navigate stepper steps

Features:
• Click framework cards to view controls
• Use pagination to navigate through controls
• Search controls using the search box
• Add new frameworks with the modal stepper
• Form validation ensures data quality

This is a pixel-perfect implementation using Bootstrap 5, SASS, and Vanilla JavaScript.`);
    }
    
    handleGlobalKeydown(event) {
        // Check for modifier keys
        const isCtrlOrCmd = event.ctrlKey || event.metaKey;
        
        if (isCtrlOrCmd) {
            switch (event.key.toLowerCase()) {
                case 'n':
                    event.preventDefault();
                    this.openNewFrameworkModal();
                    break;
                case 'h':
                    event.preventDefault();
                    this.showHelp();
                    break;
            }
        }
        
        // Handle Escape key
        if (event.key === 'Escape') {
            // Close any open modals
            const openModal = document.querySelector('.modal.show');
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
        return this.frameworkList ? this.frameworkList.getSelectedFramework() : null;
    }
    
    // Error handling
    handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);
        
        // Show user-friendly error message
        const errorMessage = `An error occurred: ${error.message || 'Unknown error'}`;
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
        document.removeEventListener('keydown', this.handleGlobalKeydown);
    }
}

// Initialize the application
const app = new App();

// Make app globally available for debugging
window.app = app;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
