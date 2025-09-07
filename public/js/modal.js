/**
 * Modal Component
 * Manages the new framework modal with stepper integration
 */

class ModalManager {
    constructor() {
        this.modal = null;
        this.stepper = null;
        this.validation = null;
        this.controls = [];
        this.frameworkList = null;
        
        this.init();
    }
    
    init() {
        this.modal = document.getElementById('newFrameworkModal');
        if (!this.modal) return;
        
        this.setupStepper();
        this.setupValidation();
        this.bindEvents();
    }
    
    setFrameworkList(frameworkList) {
        this.frameworkList = frameworkList;
        console.log('Framework list set:', this.frameworkList);
    }
    
    setupStepper() {
        const stepperContainer = document.getElementById('frameworkStepper');
        if (!stepperContainer) return;
        
        this.stepper = new Stepper(stepperContainer, {
            start: 1,
            onChange: (step) => {
                this.updateModalTitle(step);
                this.updateNavigationButtons(step);
                // Initialize controls table when reaching step 2
                if (step === 2) {
                    this.initializeControlsTable();
                }
            }
        });
    }
    
    setupValidation() {
        // Setup real-time validation
        if (typeof setupRealTimeValidation === 'function') {
            setupRealTimeValidation();
        }
    }
    
    bindEvents() {
        // Modal events
        this.modal.addEventListener('show.bs.modal', () => {
            this.onModalShow();
        });
        
        this.modal.addEventListener('hidden.bs.modal', () => {
            this.onModalHide();
        });
        
        // File selection
        const selectFileBtn = document.getElementById('selectFileBtn');
        const templateFile = document.getElementById('templateFile');
        
        if (selectFileBtn && templateFile) {
            selectFileBtn.addEventListener('click', () => {
                templateFile.click();
            });
            
            templateFile.addEventListener('change', (e) => {
                this.handleFileSelection(e);
            });
        }
        // Form submission
        const nextStepBtn = document.getElementById('nextStepBtn');
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => {
                this.handleNextStep();
            });
        }
        
        const prevStepBtn = document.getElementById('prevStepBtn');
        if (prevStepBtn) {
            prevStepBtn.addEventListener('click', () => {
                this.handlePrevStep();
            });
        }
    }
    
    onModalShow() {
        // Reset stepper to first step
        if (this.stepper) {
            this.stepper.goTo(1);
        }
        
        // Clear form
        this.clearForm();
        
        // Reset controls and initialize with sample data
        this.controls = [
            {
                id: 'Article I-0 -1.1',
                category: 'Article I, Business Contact Information',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...'
            },
            {
                id: 'Article I-0 -1.2',
                category: 'Article I, Business Contact Information',
                description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...'
            },
            {
                id: 'Article I-0 -1.3',
                category: 'Article I, Business Contact Information',
                description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...'
            },
            {
                id: 'Article II-0',
                category: 'Article II, Technical and Organizational Measures',
                description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...'
            }
        ];
        this.renderControlsTable();
    }
    
    onModalHide() {
        // Clean up
        this.clearForm();
        this.controls = [];
    }
    
    clearForm() {
        const form = document.getElementById('frameworkForm');
        if (form) {
            form.reset();
        }
        
        // Clear file selection
        const fileName = document.getElementById('fileName');
        if (fileName) {
            fileName.textContent = 'No file selected';
        }
        
        // Clear validation errors
        if (typeof Validation !== 'undefined') {
            const validation = new Validation();
            validation.clearAllErrors();
        }
    }
    
    handleFileSelection(event) {
        const file = event.target.files[0];
        const fileName = document.getElementById('fileName');
        
        if (file && fileName) {
            fileName.textContent = file.name;
        }
    }
    
    handleNextStep() {
        if (this.stepper) {
            const currentStep = this.stepper.getCurrent();
            
            if (currentStep === 1) {
                // Validate Step 1
                if (this.validateStep1()) {
                    this.stepper.next();
                }
            } else if (currentStep === 2) {
                // Finish - submit form
                this.submitForm();
            }
        }
    }
    
    handlePrevStep() {
        if (this.stepper) {
            this.stepper.prev();
        }
    }
    
    validateStep1() {
        const form = document.getElementById('frameworkForm');
        if (!form) return false;
        
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Get file data
        const templateFile = document.getElementById('templateFile');
        if (templateFile && templateFile.files.length > 0) {
            data.templateFile = templateFile.files[0];
        }
        
        // Clear previous validation messages
        this.clearValidationMessages();
        
        // Basic validation
        let isValid = true;
        if (!data.name || data.name.trim().length < 2) {
            this.showValidationMessage('frameworkName', 'Please enter a valid framework name (at least 2 characters)');
            isValid = false;
        }
        
        if (!data.shortName || data.shortName.trim().length < 2) {
            this.showValidationMessage('frameworkShortName', 'Please enter a valid short name (at least 2 characters)');
            isValid = false;
        }
        
        return isValid;
    }
    
    addControl() {
        // Mock add control functionality
        const controlId = prompt('Enter Control ID:');
        const category = prompt('Enter Category:');
        const description = prompt('Enter Description:');
        
        if (controlId && category && description) {
            const control = {
                id: controlId,
                category: category,
                description: description
            };
            
            this.controls.push(control);
            this.renderControlsTable();
        }
    }
    
    initializeControlsTable() {
        // This method is called when step 2 is reached
        this.renderControlsTable();
    }
    
    renderControlsTable() {
        const tbody = document.getElementById('controlsCrudBody');
        if (!tbody) return;
        
        if (this.controls.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted">
                        No control items added yet. Click "Add Control Items" to get started.
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = this.controls.map((control, index) => `
            <tr>
                <td>${control.id}</td>
                <td>${control.category}</td>
                <td>${control.description}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-sm btn-edit" title="Edit" onclick="modalManager.editControl(${index})">
                         <img src="assets/icons/pencil.svg" alt="sort">
                    </button>
                    <button type="button" class="btn btn-sm btn-delete" title="Delete" onclick="modalManager.deleteControl(${index})">
                         <img src="assets/icons/delete.svg" alt="sort">
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    editControl(index) {
        const control = this.controls[index];
        if (!control) return;
        
        const newId = prompt('Enter Control ID:', control.id);
        const newCategory = prompt('Enter Category:', control.category);
        const newDescription = prompt('Enter Description:', control.description);
        
        if (newId && newCategory && newDescription) {
            control.id = newId;
            control.category = newCategory;
            control.description = newDescription;
            this.renderControlsTable();
        }
    }
    
    approveControl(index) {
        const control = this.controls[index];
        if (!control) return;
        
        control.approved = true;
        this.renderControlsTable();
        alert('Control approved successfully!');
    }
    
    deleteControl(index) {
        if (confirm('Are you sure you want to delete this control?')) {
            this.controls.splice(index, 1);
            this.renderControlsTable();
        }
    }
    
    async submitForm() {
        
        const form = document.getElementById('frameworkForm');
        if (!form) {
            console.error('Form not found');
            return;
        }
        
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        console.log('Form data:', data);
        console.log('Controls:', this.controls);
        
        // Create new framework object
        const newFramework = {
            id: Date.now(),
            name: data.name,
            shortName: data.shortName,
            description: data.description || '',
            type: 'Enterprise Framework',
            status: 'ready-to-map',
            icon: 'assets/icons/Vector.svg',
            controls: this.controls
        };
        
        try {
            // Add to framework list
            if (this.frameworkList) {

                this.frameworkList.frameworks.unshift(newFramework);
                this.frameworkList.render();
                this.frameworkList.bindEvents();
            } else {
                if (window.app && window.app.frameworkList) {
                    window.app.frameworkList.frameworks.unshift(newFramework);
                    window.app.frameworkList.render();
                    window.app.frameworkList.bindEvents();
                }
            }
            
            console.log('Framework created successfully:', newFramework);
            alert('Framework created successfully!');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(this.modal);
            if (modal) {
                modal.hide();
            }
            
        } catch (error) {
            console.error('Error creating framework:', error);
            alert('Error creating framework. Please try again.');
        }
    }
    
    updateModalTitle(step) {
        const modalTitle = document.getElementById('newFrameworkModalLabel');
        if (modalTitle) {
            modalTitle.innerHTML = `Add New Framework <span class="badge modal-header-badge ms-2">${step}/2</span>`;
        }
    }
    
    updateNavigationButtons(step) {
      const prevBtn = document.getElementById('prevStepBtn');
      const nextBtn = document.getElementById('nextStepBtn');
      const addControlBtn = document.getElementById('addControlBtn');

      if (prevBtn) {
        prevBtn.style.display = step === 1 ? 'none' : 'inline-block';
      }

      if (nextBtn) {
        if (step === 2) {
          nextBtn.textContent = 'Save';
          nextBtn.classList.add('btn-success');
          nextBtn.classList.remove('btn-primary');
        } else {
          nextBtn.textContent = 'Next > Control Items';
          nextBtn.classList.add('btn-primary');
          nextBtn.classList.remove('btn-success');
        }
      }

      if (addControlBtn) {
        if (step === 2) {
          addControlBtn.style.display = 'inline-block';
          addControlBtn.classList.add('btn-secondary');
          addControlBtn.classList.remove('btn-primary');
        } else {
          addControlBtn.style.display = 'none';
        }
      }
    }

    clearValidationMessages() {
        const validationMessages = document.querySelectorAll(".validation-message");
        validationMessages.forEach(msg => msg.remove());
    }
    
    showValidationMessage(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            // Remove existing validation message
            const existingMsg = field.parentNode.querySelector(".validation-message");
            if (existingMsg) {
                existingMsg.remove();
            }
            
            // Create validation message
            const validationMsg = document.createElement("div");
            validationMsg.className = "validation-message text-danger mt-1";
            validationMsg.style.fontSize = "0.875rem";
            validationMsg.textContent = message;
            
            // Insert after the field
            field.parentNode.insertBefore(validationMsg, field.nextSibling);
        }
    }
    
    open() {
        const modal = new bootstrap.Modal(this.modal);
        modal.show();
    }
    
    close() {
        const modal = bootstrap.Modal.getInstance(this.modal);
        if (modal) {
            modal.hide();
        }
    }
}

const modalManager = new ModalManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalManager;
}
