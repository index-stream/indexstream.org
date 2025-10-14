class Indexes {
    constructor() {
        this._indexes = null;
        this._activeIndex = null;
    }

    // Set the indexes data
    setIndexes(indexes) {
        this._indexes = indexes;
    }

    // Get indexes
    getIndexes() {
        return this._indexes || [];
    }

    // Get active index
    getActiveIndex() {
        return this._activeIndex;
    }

    // Set active index
    setActiveIndex(indexId) {
        this._activeIndex = this._indexes.find(index => index.id === indexId);
    }

    // Update an existing index (local update)
    updateIndex(updatedIndex) {
        if (this._indexes) {
            const index = this._indexes.findIndex(p => p.id === updatedIndex.id);
            if (index !== -1) {
                this._indexes[index] = updatedIndex;
            }
        }
    }

    // Check if indexes are loaded
    isLoaded() {
        return this._indexes !== null;
    }
}

// Create a singleton instance
let indexes = new Indexes();
export default indexes;