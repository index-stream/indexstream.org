import Page from './Page.js';
import { PAGES } from '../constants/constants.js';
import Server from '../clients/Server.js';
import PageController from '../controllers/PageController.js';
import { getInitials } from '../utils/text.js';
import Profiles from '../models/Profiles.js';

class ProfilesPage extends Page {
    constructor() {
        super(PAGES.PROFILES);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Back button listener
        const backBtn = document.getElementById('back-to-connect-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                PageController.showPage(PAGES.CONNECT);
            });
        }
    }

    async onShow() {
        try {
            //const profiles = [
            //    {color: "#00C600", id: "1", name: "Gaurav"},
            //    {color: "#40E0D0", id: "2", name: "Yunzhe"},
            //    {color: "#7777FF", id: "3", name: "Mom"},
            //    {color: "#FF7777", id: "4", name: "Dad"},
            //    {color: "#FF8DA1", id: "5", name: "Kids"},
            //];
            const profiles = Profiles.getProfiles();
            console.log(profiles);
            
            // Render profiles
            this.renderProfiles(profiles);
            
        } catch (error) {
            console.error('Error loading profiles:', error);
            this.showError('Failed to load profiles. Please try again.');
        }
    }

    renderProfiles(profiles) {
        const contentElement = document.getElementById('profiles-content');
        if (!contentElement) return;

        // Create profiles grid with flexbox for better centering
        const profilesHTML = `
            <div class="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
                ${profiles.map(profile => this.createProfileCard(profile)).join('')}
            </div>
        `;

        contentElement.innerHTML = profilesHTML;
        this.setupProfileEventListeners();
    }

    createProfileCard(profile) {
        const initials = getInitials(profile.name);
        return `
            <div class="profile-card group cursor-pointer relative w-40 flex-shrink-0" data-profile-id="${profile.id}">
                <!-- Profile Avatar Container -->
                <div class="relative w-32 h-32 mx-auto group-hover:scale-105 transition-all duration-300">
                    <!-- Profile Avatar -->
                    <div 
                        class="w-full h-full rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
                        style="background: linear-gradient(135deg, ${profile.color}20, ${profile.color}40)"
                    >
                        <div 
                            class="w-full h-full flex items-center justify-center text-4xl font-bold text-white transition-all duration-300 group-hover:scale-110"
                            style="background: linear-gradient(135deg, ${profile.color}, ${this.darkenColor(profile.color, 20)})"
                        >
                            ${initials}
                        </div>
                    </div>
                    
                    <!-- Selection Ring -->
                    <div class="absolute inset-0 rounded-lg border-4 border-transparent transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-lg group-hover:shadow-blue-400/30 pointer-events-none"></div>
                </div>
                
                <!-- Profile Name -->
                <div class="mt-4 text-center">
                    <h3 class="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                        ${profile.name}
                    </h3>
                </div>
            </div>
        `;
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    setupProfileEventListeners() {
        const profileCards = document.querySelectorAll('.profile-card');
        profileCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const profileId = e.currentTarget.dataset.profileId;
                this.selectProfile(profileId);
            });

            // Add keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const profileId = e.currentTarget.dataset.profileId;
                    this.selectProfile(profileId);
                }
            });

            // Make cards focusable
            card.setAttribute('tabindex', '0');
        });
    }

    selectProfile(profileId) {
        // Add selection animation
        const selectedCard = document.querySelector(`[data-profile-id="${profileId}"]`);
        if (selectedCard) {
            selectedCard.style.transform = 'scale(0.95)';
            setTimeout(() => {
                selectedCard.style.transform = '';
            }, 150);
        }

        Profiles.setActiveProfile(profileId);
        PageController.showPage(PAGES.INDEXES);
    }

    showError(message) {
        const contentElement = document.getElementById('profiles-content');
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-2">Oops!</h3>
                    <p class="text-gray-300 mb-6">${message}</p>
                    <button 
                        onclick="location.reload()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            `;
        }
    }
}

export default ProfilesPage;
