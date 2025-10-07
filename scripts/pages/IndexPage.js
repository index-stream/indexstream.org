import backend from '/scripts/clients/Backend.js';
import { getErrorMessage } from '/scripts/utils/errors.js';

class IndexPage {
    constructor() {
        this.modal = document.getElementById('waitlist-modal');
        this.form = document.getElementById('waitlist-form');
        this.emailInput = document.getElementById('email');
        this.openToInterviewCheckbox = document.getElementById('openToInterview');
        this.submitBtn = document.getElementById('submit-btn');
        this.submitText = document.getElementById('submit-text');
        this.submitLoading = document.getElementById('submit-loading');
        this.successMessage = document.getElementById('success-message');
        this.errorMessage = document.getElementById('error-message');
        this.errorText = document.getElementById('error-text');
        this.copyLinkBtn = document.getElementById('copy-link-btn');
        this.copyLinkText = document.getElementById('copy-link-text');
        this.successHeader = document.getElementById('success-header');
        this.successCheckIcon = document.getElementById('success-check-icon');
        this.successInfoIcon = document.getElementById('success-info-icon');
        this.successText = document.getElementById('success-text');
        
        this.init();
    }

    init() {
        // Add event listeners for waitlist buttons
        const waitlistBtn = document.getElementById('waitlist-btn');
        const waitlistBtnCta = document.getElementById('waitlist-btn-cta');
        const closeModal = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-btn');

        if (waitlistBtn) {
            waitlistBtn.addEventListener('click', () => this.openModal());
        }
        
        if (waitlistBtnCta) {
            waitlistBtnCta.addEventListener('click', () => this.openModal());
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        // Close modal when clicking outside
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // Handle form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Handle copy link button
        if (this.copyLinkBtn) {
            this.copyLinkBtn.addEventListener('click', () => this.copyLink());
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.remove('hidden');
            this.resetForm();
            // Focus on email input
            setTimeout(() => {
                if (this.emailInput) {
                    this.emailInput.focus();
                }
            }, 100);
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            this.resetForm();
        }
    }

    resetForm() {
        if (this.form) {
            this.form.reset();
            this.form.classList.remove('hidden'); // Show form again
        }
        
        this.hideMessages();
        this.setSubmitButtonState(false);
    }

    hideMessages() {
        if (this.successMessage) {
            this.successMessage.classList.add('hidden');
        }
        if (this.errorMessage) {
            this.errorMessage.classList.add('hidden');
        }
    }

    setSubmitButtonState(isLoading) {
        if (this.submitBtn) {
            this.submitBtn.disabled = isLoading;
        }
        
        if (this.submitText) {
            this.submitText.classList.toggle('hidden', isLoading);
        }
        
        if (this.submitLoading) {
            this.submitLoading.classList.toggle('hidden', !isLoading);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput?.value?.trim();
        const openToInterview = this.openToInterviewCheckbox?.checked || false;

        if (!email) {
            this.showError('Please enter a valid email address.');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('Please enter a valid email address.');
            return;
        }

        this.setSubmitButtonState(true);
        this.hideMessages();

        try {
            await backend.addToWaitlist(email, openToInterview);
            this.showSuccess(false);
            
        } catch (error) {
            let errorMessage = getErrorMessage(error);
            if(errorMessage.status === 409) {
                this.showSuccess(true);
            } else {
                console.error('Error adding to waitlist:', error);
                this.showError('Failed to join waitlist. Please try again.');
            }
        } finally {
            this.setSubmitButtonState(false);
        }
    }

    showSuccess(wasAlreadyOnWaitlist = false) {
        // Hide the form
        if (this.form) {
            this.form.classList.add('hidden');
        }
        
        // Update success message content based on whether user was already on waitlist
        if (wasAlreadyOnWaitlist) {
            // Update to "already on waitlist" styling and content
            if (this.successHeader) {
                this.successHeader.className = 'p-4 bg-blue-900 border border-blue-700 rounded-lg mb-4';
            }
            // Show info icon, hide checkmark icon
            if (this.successCheckIcon) {
                this.successCheckIcon.classList.add('hidden');
            }
            if (this.successInfoIcon) {
                this.successInfoIcon.classList.remove('hidden');
            }
            if (this.successText) {
                this.successText.className = 'font-medium';
                this.successText.textContent = "You're already on the waitlist!";
            }
        } else {
            // Update to normal success styling and content
            if (this.successHeader) {
                this.successHeader.className = 'p-4 bg-green-900 border border-green-700 rounded-lg mb-4';
            }
            // Show checkmark icon, hide info icon
            if (this.successCheckIcon) {
                this.successCheckIcon.classList.remove('hidden');
            }
            if (this.successInfoIcon) {
                this.successInfoIcon.classList.add('hidden');
            }
            if (this.successText) {
                this.successText.className = 'font-medium';
                this.successText.textContent = 'Successfully joined the waitlist!';
            }
        }
        
        // Show success message with social sharing
        if (this.successMessage) {
            this.successMessage.classList.remove('hidden');
        }
        if (this.errorMessage) {
            this.errorMessage.classList.add('hidden');
        }
    }

    showError(message) {
        if (this.errorText) {
            this.errorText.textContent = message;
        }
        if (this.errorMessage) {
            this.errorMessage.classList.remove('hidden');
        }
        if (this.successMessage) {
            this.successMessage.classList.add('hidden');
        }
    }

    async copyLink() {
        const url = window.location.origin;
        
        try {
            await navigator.clipboard.writeText(url);
            
            // Update button text temporarily
            if (this.copyLinkText) {
                const originalText = this.copyLinkText.textContent;
                this.copyLinkText.textContent = 'Copied!';
                
                setTimeout(() => {
                    this.copyLinkText.textContent = originalText;
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IndexPage();
});
