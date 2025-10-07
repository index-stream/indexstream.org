import Backend from '/scripts/clients/Backend.js';
import { getErrorMessage } from '/scripts/utils/errors.js';

class LeaveWaitlistPage {
    constructor() {
        // Get all elements
        this._loadingSection = document.querySelector('#loading-section');
        this._confirmationSection = document.querySelector('#confirmation-section');
        this._errorSection = document.querySelector('#error-section');
        this._successModal = document.querySelector('#success-modal');
        this._errorModal = document.querySelector('#error-modal');
        this._emailDisplay = document.querySelector('#email-display');
        this._cancelButton = document.querySelector('#cancel-removal');
        this._confirmButton = document.querySelector('#confirm-removal');
        this._closeErrorButton = document.querySelector('#close-error-modal');
        this._errorMessage = document.querySelector('#error-message');
        
        this._token = null;
        this._emailAddress = null;
        
        this.init();
    }

    init() {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this._token = urlParams.get('token');
        
        if (!this._token) {
            this.showError('No token provided in the URL');
            return;
        }
        
        // Parse JWT to get email address
        try {
            this._emailAddress = this.parseJWTEmail(this._token);
            if (!this._emailAddress) {
                this.showError('Invalid token format');
                return;
            }
            
            // Show confirmation section
            this.showConfirmation();
        } catch (error) {
            console.error('Error parsing JWT:', error);
            this.showError('Invalid or expired token');
        }
        
        this.setupEventListeners();
    }

    parseJWTEmail(token) {
        try {
            // JWT has 3 parts separated by dots: header.payload.signature
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }
            
            // Decode the payload (second part)
            const payload = parts[1];
            
            // Add padding if needed for base64 decoding
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            
            // Decode base64
            const decodedPayload = atob(paddedPayload);
            
            // Parse JSON
            const payloadObj = JSON.parse(decodedPayload);
            
            // Extract email address
            return payloadObj.emailAddress || payloadObj.email || null;
        } catch (error) {
            console.error('JWT parsing error:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Cancel button
        if (this._cancelButton) {
            this._cancelButton.addEventListener('click', () => {
                window.location.href = '/';
            });
        }
        
        // Confirm removal button
        if (this._confirmButton) {
            this._confirmButton.addEventListener('click', () => {
                this.handleRemoval();
            });
        }
        
        // Close error modal button
        if (this._closeErrorButton) {
            this._closeErrorButton.addEventListener('click', () => {
                this.closeErrorModal();
            });
        }
        
        // Close modals when clicking outside
        if (this._successModal) {
            this._successModal.addEventListener('click', (e) => {
                if (e.target === this._successModal) {
                    this.closeSuccessModal();
                }
            });
        }
        
        if (this._errorModal) {
            this._errorModal.addEventListener('click', (e) => {
                if (e.target === this._errorModal) {
                    this.closeErrorModal();
                }
            });
        }
    }

    showLoading() {
        this.hideAllSections();
        if (this._loadingSection) {
            this._loadingSection.classList.remove('hidden');
        }
    }

    showConfirmation() {
        this.hideAllSections();
        if (this._confirmationSection && this._emailDisplay) {
            this._emailDisplay.textContent = this._emailAddress;
            this._confirmationSection.classList.remove('hidden');
        }
    }

    showError(message) {
        this.hideAllSections();
        if (this._errorSection) {
            this._errorSection.classList.remove('hidden');
        }
        console.error('Leave waitlist error:', message);
    }

    showErrorModal(message) {
        if (this._errorModal && this._errorMessage) {
            this._errorMessage.textContent = message;
            this._errorModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeErrorModal() {
        if (this._errorModal) {
            this._errorModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    showSuccessModal(alreadyRemoved = false) {
        if (this._successModal) {
            // Update content based on whether user was already removed
            const title = this._successModal.querySelector('h3');
            const description = this._successModal.querySelector('p');
            
            if (alreadyRemoved) {
                title.textContent = 'Already Removed';
                description.textContent = 'You were already removed from our waitlist. No further action needed!';
            } else {
                title.textContent = 'Successfully Removed';
                description.textContent = 'You have been removed from our waitlist. We\'re sorry to see you go!';
            }
            
            this._successModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeSuccessModal() {
        if (this._successModal) {
            this._successModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    hideAllSections() {
        if (this._loadingSection) {
            this._loadingSection.classList.add('hidden');
        }
        if (this._confirmationSection) {
            this._confirmationSection.classList.add('hidden');
        }
        if (this._errorSection) {
            this._errorSection.classList.add('hidden');
        }
    }

    async handleRemoval() {
        if (!this._token) {
            this.showErrorModal('No token available for removal');
            return;
        }

        // Set loading state
        const originalText = this._confirmButton.textContent;
        this._confirmButton.disabled = true;
        this._confirmButton.textContent = 'Removing...';
        this._confirmButton.classList.add('opacity-75', 'cursor-not-allowed');

        try {
            await Backend.removeFromWaitlist(this._token);
            
            // Show success modal
            this.showSuccessModal();
            
        } catch (error) {
            console.error('Error removing from waitlist:', error);
            
            let errorMessage = getErrorMessage(error);
            
            if (errorMessage?.body?.data?.[0] && errorMessage.body.data[0].includes('not found in waitlist')) {
                this.showSuccessModal(true);
                return;
            }
            
            this.showErrorModal('Sorry, there was an error removing you from the waitlist. Please try again.');
        } finally {
            // Reset button state
            this._confirmButton.disabled = false;
            this._confirmButton.textContent = originalText;
            this._confirmButton.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }
}

const leaveWaitlistPage = new LeaveWaitlistPage();
export default leaveWaitlistPage;