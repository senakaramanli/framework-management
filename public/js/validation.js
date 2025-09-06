/**
 * Validation Module
 * Form validation for Step 1 of the framework creation
 */

class Validation {
    constructor() {
        this.rules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 80,
                message: 'Name must be between 2 and 80 characters'
            },
            shortName: {
                required: true,
                minLength: 2,
                maxLength: 16,
                pattern: /^[A-Z0-9\-_.]{2,16}$/,
                message: 'Short name must be 2-16 characters, uppercase letters, numbers, hyphens, underscores, or dots only'
            },
            description: {
                required: false,
                maxLength: 500,
                message: 'Description must be 500 characters or less'
            },
            template: {
                required: false,
                accept: ['.xlsx', '.xls', '.csv'],
                message: 'Template must be an Excel or CSV file'
            }
        };
    }
    
    validateField(fieldName, value, file = null) {
        const rule = this.rules[fieldName];
        if (!rule) return { valid: true };
        
        // Required field check
        if (rule.required && (!value || value.trim() === '')) {
            return {
                valid: false,
                message: `${this.getFieldLabel(fieldName)} is required`
            };
        }
        
        // Skip other validations if field is empty and not required
        if (!value || value.trim() === '') {
            return { valid: true };
        }
        
        // Length validations
        if (rule.minLength && value.length < rule.minLength) {
            return {
                valid: false,
                message: `${this.getFieldLabel(fieldName)} must be at least ${rule.minLength} characters`
            };
        }
        
        if (rule.maxLength && value.length > rule.maxLength) {
            return {
                valid: false,
                message: `${this.getFieldLabel(fieldName)} must be ${rule.maxLength} characters or less`
            };
        }
        
        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
            return {
                valid: false,
                message: rule.message
            };
        }
        
        // File validation
        if (file && rule.accept) {
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            if (!rule.accept.includes(fileExtension)) {
                return {
                    valid: false,
                    message: rule.message
                };
            }
        }
        
        return { valid: true };
    }
    
    validateForm(formData) {
        const errors = {};
        let isValid = true;
        
        // Validate each field
        Object.keys(this.rules).forEach(fieldName => {
            const value = formData[fieldName];
            const file = formData[`${fieldName}File`];
            const result = this.validateField(fieldName, value, file);
            
            if (!result.valid) {
                errors[fieldName] = result.message;
                isValid = false;
            }
        });
        
        return {
            valid: isValid,
            errors: errors
        };
    }
    
    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            shortName: 'Short Name',
            description: 'Description',
            template: 'Template'
        };
        return labels[fieldName] || fieldName;
    }
    
    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        field.classList.add('is-invalid');
        
        let feedback = field.parentNode.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.appendChild(feedback);
        }
        
        feedback.textContent = message;
    }
    
    clearFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        field.classList.remove('is-invalid');
        
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = '';
        }
    }
    
    clearAllErrors() {
        Object.keys(this.rules).forEach(fieldName => {
            this.clearFieldError(fieldName);
        });
    }
}

// Guard function for stepper
function canExit(currentStep, nextStep) {
    if (currentStep === 1 && nextStep === 2) {
        // Validate Step 1 before allowing Step 2
        const validation = new Validation();
        const formData = getFormData();
        const result = validation.validateForm(formData);
        
        if (!result.valid) {
            // Show errors
            validation.clearAllErrors();
            Object.keys(result.errors).forEach(fieldName => {
                validation.showFieldError(fieldName, result.errors[fieldName]);
            });
            return false;
        } else {
            // Clear any existing errors
            validation.clearAllErrors();
        }
    }
    
    return true;
}

// Helper function to get form data
function getFormData() {
    const form = document.querySelector('#frameworkForm');
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Get file data
    const templateFile = document.querySelector('#templateFile');
    if (templateFile && templateFile.files.length > 0) {
        data.templateFile = templateFile.files[0];
    }
    
    return data;
}

// Real-time validation
function setupRealTimeValidation() {
    const validation = new Validation();
    
    // Validate on input/change
    const fields = document.querySelectorAll('#frameworkForm [name]');
    fields.forEach(field => {
        field.addEventListener('blur', () => {
            const fieldName = field.name;
            const value = field.value;
            const file = field.type === 'file' ? field.files[0] : null;
            
            const result = validation.validateField(fieldName, value, file);
            
            if (result.valid) {
                validation.clearFieldError(fieldName);
            } else {
                validation.showFieldError(fieldName, result.message);
            }
        });
        
        field.addEventListener('input', () => {
            // Clear error on input
            validation.clearFieldError(field.name);
        });
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Validation, canExit, setupRealTimeValidation };
}
