class Profiles {
    constructor() {
        this._profiles = null;
        this._activeProfile = null;
    }

    // Set the profiles data
    setProfiles(profiles) {
        this._profiles = profiles;
    }

    // Get profiles
    getProfiles() {
        return this._profiles || [];
    }

    // Get active profile
    getActiveProfile() {
        return this._activeProfile;
    }

    // Set active profile
    setActiveProfile(profileId) {
        this._activeProfile = this._profiles.find(profile => profile.id === profileId);
    }

    // Update an existing profile (local update)
    updateProfile(updatedProfile) {
        if (this._profiles) {
            const index = this._profiles.findIndex(p => p.id === updatedProfile.id);
            if (index !== -1) {
                this._profiles[index] = updatedProfile;
            }
        }
    }

    // Check if profiles are loaded
    isLoaded() {
        return this._profiles !== null;
    }
}

// Create a singleton instance
let profiles = new Profiles();
export default profiles;