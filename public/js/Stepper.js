/**
 * Generic Stepper Component
 * State machine approach with data-* attributes
 * NO show/hide functions - only CSS-based visibility
 */
class Stepper {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            start: 1,
            stepsSelector: '[data-step]',
            onBeforeChange: null,
            onChange: null,
            ...options
        };
        
        this.currentStep = this.options.start;
        this.steps = this.container.querySelectorAll(this.options.stepsSelector);
        this.guard = null;
        
        this.init();
    }
    
    init() {
        this.updateStepVisibility();
        this.updateProgress();
        console.log(`Stepper: moved to step ${this.currentStep}`);
        this.bindEvents();
        
        if (this.options.onChange) {
            this.options.onChange(this.currentStep);
        }
    }
    
    bindEvents() {
        // Bind stepper navigation buttons
        const prevBtn = this.container.querySelector('[data-stepper-prev]');
        const nextBtn = this.container.querySelector('[data-stepper-next]');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.next();
            }
        });
    }
    
    getCurrent() {
        return this.currentStep;
    }
    
    goTo(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.steps.length) {
            console.warn(`Step ${stepNumber} is out of range`);
            return false;
        }
        
        // Check guard function
        if (this.guard && !this.guard(this.currentStep, stepNumber)) {
            return false;
        }
        
        // Check onBeforeChange callback
        if (this.options.onBeforeChange && !this.options.onBeforeChange(this.currentStep, stepNumber)) {
            return false;
        }
        
        this.currentStep = stepNumber;
        this.updateStepVisibility();
        this.updateProgress();
        console.log(`Stepper: moved to step ${this.currentStep}`);
        
        if (this.options.onChange) {
            this.options.onChange(this.currentStep);
        }
        
        return true;
    }
    
    next() {
        return this.goTo(this.currentStep + 1);
    }
    
    prev() {
        return this.goTo(this.currentStep - 1);
    }
    
    setGuard(guardFunction) {
        this.guard = guardFunction;
    }
    
    updateStepVisibility() {
        // Update container attribute for CSS-based visibility
        this.container.dataset.currentStep = this.currentStep;
        
        // Update individual step attributes
        this.steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.dataset.active = (stepNumber === this.currentStep).toString();
        });
    }
    
    updateProgress() {
        const progressContainer = this.container.querySelector('.stepper-progress');
        console.log('Progress container found:', progressContainer);
        if (!progressContainer) {
            console.log('Progress container not found, searching in document');
            const docProgressContainer = document.querySelector('.stepper-progress');
            if (docProgressContainer) {
                console.log('Found progress container in document');
                const progressSteps = docProgressContainer.querySelectorAll('.stepper-step');
                progressSteps.forEach((step, index) => {
                    const stepNumber = index + 1;
                    step.classList.remove('stepper-step--active', 'stepper-step--completed');
                    if (stepNumber === this.currentStep) {
                        step.classList.add('stepper-step--active');
                        console.log(`Step ${stepNumber}: added active class`);
                    } else if (stepNumber < this.currentStep) {
                        step.classList.add('stepper-step--active');
                        console.log(`Step ${stepNumber}: adding active class (previous step)`);
                    }
                });
            }
            return;
        }
        
        const progressSteps = progressContainer.querySelectorAll('.stepper-step');
        
        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('stepper-step--active', 'stepper-step--completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('stepper-step--active');
                console.log(`Step ${stepNumber}: added active class`);
            } else if (stepNumber < this.currentStep) {
                console.log(`Step ${stepNumber}: adding active class (previous step)`);
                step.classList.add('stepper-step--active');
                console.log(`Step ${stepNumber}: added active class`);
            }
        });
        
        // Update modal title
        const modalTitle = document.querySelector('#newFrameworkModalLabel');
        if (modalTitle) {
            modalTitle.textContent = `Add New Framework ${this.currentStep}/${this.steps.length}`;
        }
        
        // Update header badge
        const headerBadge = document.querySelector('#headerBadge');
        if (headerBadge) {
            headerBadge.textContent = `${this.currentStep}/${this.steps.length}`;
        }
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    updateNavigationButtons() {
        const prevBtn = this.container.querySelector('[data-stepper-prev]');
        const nextBtn = this.container.querySelector('[data-stepper-next]');
        
        if (prevBtn) {
            if (this.currentStep === 1) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'inline-block';
            }
        }
        
        if (nextBtn) {
            if (this.currentStep === this.steps.length) {
                nextBtn.textContent = 'Finish';
                nextBtn.classList.add('btn-success');
                nextBtn.classList.remove('btn-primary');
            } else {
                nextBtn.textContent = `Next > Control Items`;
                nextBtn.classList.add('btn-primary');
                nextBtn.classList.remove('btn-success');
            }
        }
    }
    
    destroy() {
        // Remove event listeners
        const prevBtn = this.container.querySelector('[data-stepper-prev]');
        const nextBtn = this.container.querySelector('[data-stepper-next]');
        
        if (prevBtn) {
            prevBtn.removeEventListener('click', this.prev);
        }
        
        if (nextBtn) {
            nextBtn.removeEventListener('click', this.next);
        }
        
        this.container.removeEventListener('keydown', this.handleKeydown);
    }
}

// Factory function for creating steppers
function createStepper(container, options = {}) {
    return new Stepper(container, options);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Stepper, createStepper };
}
