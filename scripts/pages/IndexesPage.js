import Page from './Page.js';
import { PAGES } from '../constants/constants.js';
import Server from '../clients/Server.js';
import PageController from '../controllers/PageController.js';

class IndexesPage extends Page {
    constructor() {
        super(PAGES.INDEXES);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listeners will be added here when needed
    }

    async onShow() {
        console.log('Indexes page shown');
        
        try {
            // Simulate API call - replace with actual Server.getIndexes() when ready
            let indexes = [
                {
                    "id": "ff6344c9-1f14-4104-9c15-d705535d8cd2",
                    "name": "Home",
                    "mediaType": "videos",
                    "icon": "home"
                },
                {
                    "id": "456fe7bd-5884-4340-8bed-28d28hhsns8s",
                    "name": "Home Videos",
                    "mediaType": "videos",
                    "icon": "videos"
                },
                {
                    "id": "789abc12-3456-7890-def1-234567890abc",
                    "name": "Music Library",
                    "mediaType": "music",
                    "icon": "music"
                },
                {
                    "id": "def45678-9012-3456-7890-123456789def",
                    "name": "Photos",
                    "mediaType": "photos",
                    "icon": "photos"
                },
                {
                    "id": "456fe7bd-5884-4340-8bed-350daa9455f7",
                    "name": "Anime",
                    "mediaType": "videos",
                    "icon": "custom"
                },
                {
                    "id": "456fe7bd-5884-4340-8bed-350daa9455f6",
                    "name": "Educational",
                    "mediaType": "videos",
                    "icon": "custom"
                },
                {
                    "id": "456fe7bd-5884-4340-8bed-350daa9455f5",
                    "name": "Me",
                    "mediaType": "photos",
                    "icon": "custom"
                  }
            ];
            
            // Render indexes or empty state
            if (indexes.length === 0) {
                this.renderEmptyState();
            } else {
                this.renderIndexes(indexes);
            }
            
        } catch (error) {
            console.error('Error loading indexes:', error);
            this.showError('Failed to load indexes. Please try again.');
        }
    }

    renderIndexes(indexes) {
        const contentElement = document.getElementById('indexes-content');
        if (!contentElement) return;

        // Create indexes grid with flexbox for better centering
        const indexesHTML = `
            <div class="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
                ${indexes.map(index => this.createIndexCard(index)).join('')}
            </div>
        `;

        contentElement.innerHTML = indexesHTML;
        this.setupIndexEventListeners();
    }

    renderEmptyState() {
        // Simply update the header text to show the empty state message
        const headerElement = document.querySelector('#indexes-page .text-center p');
        if (headerElement) {
            headerElement.textContent = 'You need to add an index on your Index Media Server before you can start streaming.';
        }
        
        // Clear the content area
        const contentElement = document.getElementById('indexes-content');
        if (contentElement) {
            contentElement.innerHTML = '';
        }
    }

    createIndexCard(index) {
        const backgroundClass = this.getBackgroundClass(index.icon);
        
        return `
            <div class="index-card group cursor-pointer relative w-40 flex-shrink-0" data-index-id="${index.id}">
                <!-- Index Icon Container -->
                <div class="relative w-32 h-32 mx-auto group-hover:scale-105 transition-all duration-300">
                    <!-- Index Icon -->
                    <div class="w-full h-full rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/20 border border-gray-600 group-hover:border-blue-400 ${backgroundClass}">
                        <div class="w-full h-full flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105 overflow-hidden">
                            ${this.getIndexIcon(index)}
                        </div>
                    </div>
                    
                    <!-- Selection Ring -->
                    <div class="absolute inset-0 rounded-lg border-4 border-transparent transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-lg group-hover:shadow-blue-400/30 pointer-events-none"></div>
                </div>
                
                <!-- Index Name -->
                <div class="mt-4 text-center">
                    <h3 class="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                        ${index.name}
                    </h3>
                    <p class="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        ${this.getMediaTypeLabel(index.mediaType)}
                    </p>
                </div>
            </div>
        `;
    }

    getBackgroundClass(icon) {
        switch (icon) {
            case 'videos':
                return 'bg-gradient-to-r from-blue-600 to-blue-700';
            case 'music':
                return 'bg-gradient-to-r from-green-600 to-green-700';
            case 'photos':
                return 'bg-gradient-to-r from-purple-600 to-purple-700';
            case 'home':
            default:
                return 'bg-gradient-to-r from-slate-600 to-slate-700';
        }
    }

    getIndexIcon(index) {
        if (index.icon === 'custom') {
            // Use custom icon from server - full size
            const serverUrl = Server.getServerUrl();
            return `<img src="${serverUrl}api/index/${index.id}/icon" alt="${index.name}" class="object-contain max-h-full max-w-full" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-lg" style="display: none;">
                         <img src="./images/icon_image.svg" alt="Custom" class="w-16 h-16 text-gray-400">
                     </div>`;
        } else {
            // Use predefined SVG icons
            return this.getPredefinedIcon(index.icon, index.mediaType);
        }
    }

    getPredefinedIcon(icon, mediaType) {
        const iconSize = 'w-16 h-16';
        
        switch (icon) {
            case 'home':
                return `<img src="./images/icon_home.svg" alt="Home" class="${iconSize} text-slate-300">`;
            
            case 'music':
                return `<img src="./images/icon_music.svg" alt="Music" class="${iconSize} text-green-400">`;
            
            case 'photos':
                return `<img src="./images/icon_image.svg" alt="Photos" class="${iconSize} text-purple-400">`;
            
            case 'videos':
            default:
                return `<img src="./images/icon_movie.svg" alt="Videos" class="${iconSize} text-blue-400">`;
        }
    }

    getMediaTypeLabel(mediaType) {
        switch (mediaType) {
            case 'videos': return 'Videos';
            case 'music': return 'Music';
            case 'photos': return 'Photos';
            default: return 'Media';
        }
    }

    setupIndexEventListeners() {
        const indexCards = document.querySelectorAll('.index-card');
        indexCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const indexId = e.currentTarget.dataset.indexId;
                this.selectIndex(indexId);
            });

            // Add keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const indexId = e.currentTarget.dataset.indexId;
                    this.selectIndex(indexId);
                }
            });

            // Make cards focusable
            card.setAttribute('tabindex', '0');
        });
    }

    selectIndex(indexId) {
        // Add selection animation
        const selectedCard = document.querySelector(`[data-index-id="${indexId}"]`);
        if (selectedCard) {
            selectedCard.style.transform = 'scale(0.95)';
            setTimeout(() => {
                selectedCard.style.transform = '';
            }, 150);
        }

        Server.setActiveIndex(indexId);
        // TODO: Navigate to next page or handle index selection
        console.log('Index selected:', indexId);
    }

    showError(message) {
        const contentElement = document.getElementById('indexes-content');
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

export default IndexesPage;
