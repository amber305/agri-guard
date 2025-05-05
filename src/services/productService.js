// Product Service for AgriGuard Marketplace
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Fetch products with filtering and pagination
export const fetchProducts = async(filters = {}) => {
    try {
        // Convert categories array to comma-separated string if present
        const queryFilters = { ...filters };
        if (Array.isArray(queryFilters.categories)) {
            queryFilters.categories = queryFilters.categories.join(',');
        }
        const queryString = new URLSearchParams(queryFilters).toString();
        const response = await fetch(`${API_BASE_URL}/products?${queryString}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
    }
};


export const getProductById = async(id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch product ${id}:`, error);
        throw error;
    }
};

// Product search functionality
export const searchProducts = async(query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Search failed:', error);
        throw error;
    }
};