/**
 * Generic Stepper Component
 * State machine approach with data-* attributes
 * NO show/hide functions - only CSS-based visibility
 * Can be used for any stepper implementation
 */
class Stepper {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            start: 1,
            stepsSelector: '[data-step]',
            progressSelector: '.stepper-progress',
            stepSelector: '.stepper-step',
            onBeforeChange: null,
            onChange: null,
            onComplete: null,
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
    
    getTotalSteps() {
        return this.steps.length;
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
        
        if (this.options.onChange) {
            this.options.onChange(this.currentStep);
        }
        
        // Check if completed
        if (this.currentStep === this.steps.length && this.options.onComplete) {
            this.options.onComplete();
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
        const progressContainer = this.container.querySelector(this.options.progressSelector);
        
        if (!progressContainer) {
            return;
        }
        
        const progressSteps = progressContainer.querySelectorAll(this.options.stepSelector);
        
        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('stepper-step--active', 'stepper-step--completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('stepper-step--active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('stepper-step--active');
            }
        });
    }
    
    updateNavigationButtons() {
        const prevBtn = this.container.querySelector('[data-stepper-prev]');
        const nextBtn = this.container.querySelector('[data-stepper-next]');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-block';
        }
        
        if (nextBtn) {
            if (this.currentStep === this.steps.length) {
                nextBtn.textContent = 'Finish';
                nextBtn.classList.add('btn-success');
                nextBtn.classList.remove('btn-primary');
            } else {
                nextBtn.textContent = 'Next';
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
