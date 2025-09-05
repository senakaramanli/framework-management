/**
 * Stepper - Generic reusable stepper component
 */
class Stepper {
  constructor(container) {
    this.container = container;
    this.currentStep = 1;
    this.totalSteps = this.getTotalSteps();
    this.init();
  }

  init() {
    console.log('Stepper initialized with', this.totalSteps, 'steps');
    this.setupEventListeners();
    this.updateProgress();
  }

  getTotalSteps() {
    const steps = this.container.querySelectorAll('[data-step]');
    return steps.length;
  }

  setupEventListeners() {
    // Next button - use direct event listener
    const nextBtn = document.querySelector('[data-stepper-next]');
    if (nextBtn) {
      console.log('Next button found:', nextBtn);
      // Remove any existing listeners
      nextBtn.removeEventListener('click', this.handleNextClick);
      // Add new listener
      this.handleNextClick = (e) => {
        e.preventDefault();
        console.log('Next button clicked!');
        this.nextStep();
      };
      nextBtn.addEventListener('click', this.handleNextClick);
    } else {
      console.error('Next button not found!');
    }

    // Previous button
    const prevBtn = document.querySelector('[data-stepper-prev]');
    if (prevBtn) {
      console.log('Previous button found:', prevBtn);
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Previous button clicked!');
        this.prevStep();
      });
    }

    // Complete button
    const completeBtn = document.querySelector('[data-stepper-complete]');
    if (completeBtn) {
      console.log('Complete button found:', completeBtn);
      completeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Complete button clicked!');
        this.complete();
      });
    }
  }

  nextStep() {
    console.log('nextStep called, currentStep:', this.currentStep, 'totalSteps:', this.totalSteps);
    
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      console.log('Moving to step:', this.currentStep);
      this.updateProgress();
      this.updateModalTitle();
    } else {
      console.log('Already at last step');
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      console.log('Moving to step:', this.currentStep);
      this.updateProgress();
      this.updateModalTitle();
    }
  }

  complete() {
    console.log('Stepper completed');
    // Close modal
    const modal = document.getElementById('newFrameworkModal');
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  updateProgress() {
    console.log('updateProgress called, currentStep:', this.currentStep);

    // Update step indicators
    const stepIndicators = document.querySelectorAll('.stepper-step');
    stepIndicators.forEach((indicator, index) => {
      const stepNumber = index + 1;
      if (stepNumber <= this.currentStep) {
        indicator.classList.add('stepper-step--active');
      } else {
        indicator.classList.remove('stepper-step--active');
      }
    });

    // Update step content
    const steps = this.container.querySelectorAll('[data-step]');
    steps.forEach((step, index) => {
      const stepNumber = index + 1;
      if (stepNumber === this.currentStep) {
        step.classList.add('stepper__step--active');
      } else {
        step.classList.remove('stepper__step--active');
      }
    });

    // Update buttons
    this.updateButtons();
  }

  updateButtons() {
    const prevBtn = document.querySelector('[data-stepper-prev]');
    const nextBtn = document.querySelector('[data-stepper-next]');
    const completeBtn = document.querySelector('[data-stepper-complete]');

    console.log('updateButtons called, currentStep:', this.currentStep);

    // Hide all buttons first
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (completeBtn) completeBtn.style.display = 'none';

    // Show appropriate buttons based on current step
    if (this.currentStep === 1) {
      // First step: show next button
      if (nextBtn) {
        nextBtn.style.display = 'inline-block';
        console.log('Step 1: Showing next button');
      }
    } else if (this.currentStep === this.totalSteps) {
      // Last step: show previous and complete buttons
      if (prevBtn) {
        prevBtn.style.display = 'inline-block';
        console.log('Last step: Showing previous button');
      }
      if (completeBtn) {
        completeBtn.style.display = 'inline-block';
        console.log('Last step: Showing complete button');
      }
    }
  }

  updateModalTitle() {
    const title = document.querySelector('.modal-title');
    if (title) {
      title.textContent = `Add New Framework ${this.currentStep}/${this.totalSteps}`;
    }
  }
}

// Export for use in other modules
window.Stepper = Stepper;
