import { useState, useEffect, useMemo } from 'react';

const useRestaurantFilters = (restaurants) => {
    const [filters, setFilters] = useState({
        search: '',
        cuisine: '',
        rating: '',
        priceRange: '',
        sortBy: 'rating'
    });

    const filteredRestaurants = useMemo(() => {
        return restaurants.filter(restaurant => {
            // Search filter
            if (filters.search && !restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) &&
                !restaurant.cuisine.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }

            // Cuisine filter
            if (filters.cuisine && restaurant.cuisine !== filters.cuisine) {
                return false;
            }

            // Rating filter
            if (filters.rating && restaurant.rating < parseFloat(filters.rating)) {
                return false;
            }

            // Price range filter
            if (filters.priceRange && restaurant.priceRange !== filters.priceRange) {
                return false;
            }

            return true;
        }).sort((a, b) => {
            switch (filters.sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'deliveryTime':
                    return parseInt(a.deliveryTime.split('-')[0]) - parseInt(b.deliveryTime.split('-')[0]);
                case 'priceRange':
                    return parseInt(a.priceRange.replace('₹', '').split('-')[0]) - 
                           parseInt(b.priceRange.replace('₹', '').split('-')[0]);
                default:
                    return 0;
            }
        });
    }, [restaurants, filters]);

    const updateFilter = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return {
        filters,
        updateFilter,
        filteredRestaurants
    };
};

export default useRestaurantFilters;
