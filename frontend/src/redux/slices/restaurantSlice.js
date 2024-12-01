import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchRestaurants = createAsyncThunk(
    'restaurant/fetchRestaurants',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/restaurants`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurants');
        }
    }
);

export const fetchRestaurantById = createAsyncThunk(
    'restaurant/fetchRestaurantById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/restaurants/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant');
        }
    }
);

export const fetchOwnerRestaurants = createAsyncThunk(
    'restaurant/fetchOwnerRestaurants',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${API_URL}/restaurants/owner/me`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch your restaurants');
        }
    }
);

export const createRestaurant = createAsyncThunk(
    'restaurant/createRestaurant',
    async (restaurantData, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(`${API_URL}/restaurants`, restaurantData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create restaurant');
        }
    }
);

export const updateRestaurant = createAsyncThunk(
    'restaurant/updateRestaurant',
    async ({ id, ...updateData }, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`${API_URL}/restaurants/${id}`, updateData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update restaurant');
        }
    }
);

export const deleteRestaurant = createAsyncThunk(
    'restaurant/deleteRestaurant',
    async (id, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`${API_URL}/restaurants/${id}`, config);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete restaurant');
        }
    }
);

export const toggleRestaurantStatus = createAsyncThunk(
    'restaurant/toggleStatus',
    async ({ id, isOpen }, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.patch(
                `${API_URL}/restaurants/${id}/toggle-status`,
                { isOpen },
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle restaurant status');
        }
    }
);

export const updateRestaurantHours = createAsyncThunk(
    'restaurant/updateHours',
    async ({ id, operatingHours }, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.patch(
                `${API_URL}/restaurants/${id}/hours`,
                { operatingHours },
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update operating hours');
        }
    }
);

export const updateBankDetails = createAsyncThunk(
    'restaurant/updateBankDetails',
    async ({ id, bankDetails }, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.patch(
                `${API_URL}/restaurants/${id}/bank-details`,
                { bankDetails },
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update bank details');
        }
    }
);

export const getRestaurantStats = createAsyncThunk(
    'restaurant/getStats',
    async (id, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().auth;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${API_URL}/restaurants/${id}/stats`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant statistics');
        }
    }
);

const initialState = {
    restaurants: null,
    selectedRestaurant: null,
    stats: null,
    loading: false,
    error: null,
    success: false,
    actionLoading: false,
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        setSelectedRestaurant: (state, action) => {
            state.selectedRestaurant = action.payload;
        },
        resetRestaurantState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch restaurants
            .addCase(fetchRestaurants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurants = action.payload;
                state.error = null;
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch restaurant by id
            .addCase(fetchRestaurantById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRestaurantById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRestaurant = action.payload;
                state.error = null;
            })
            .addCase(fetchRestaurantById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch owner restaurants
            .addCase(fetchOwnerRestaurants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOwnerRestaurants.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurants = action.payload;
                state.error = null;
            })
            .addCase(fetchOwnerRestaurants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create restaurant
            .addCase(createRestaurant.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createRestaurant.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.restaurants = {
                    ...state.restaurants,
                    data: [...(state.restaurants?.data || []), action.payload.data],
                };
                state.success = true;
                state.error = null;
            })
            .addCase(createRestaurant.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Update restaurant
            .addCase(updateRestaurant.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateRestaurant.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.restaurants = {
                    ...state.restaurants,
                    data: state.restaurants?.data?.map(restaurant =>
                        restaurant._id === action.payload.data._id ? action.payload.data : restaurant
                    ),
                };
                state.success = true;
                state.error = null;
            })
            .addCase(updateRestaurant.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Delete restaurant
            .addCase(deleteRestaurant.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(deleteRestaurant.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.restaurants = {
                    ...state.restaurants,
                    data: state.restaurants?.data?.filter(restaurant => restaurant._id !== action.payload),
                };
                state.error = null;
            })
            .addCase(deleteRestaurant.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Toggle status
            .addCase(toggleRestaurantStatus.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(toggleRestaurantStatus.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.restaurants = {
                    ...state.restaurants,
                    data: state.restaurants?.data?.map(restaurant =>
                        restaurant._id === action.payload.data._id ? action.payload.data : restaurant
                    ),
                };
                state.error = null;
            })
            .addCase(toggleRestaurantStatus.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Get stats
            .addCase(getRestaurantStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRestaurantStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.data;
                state.error = null;
            })
            .addCase(getRestaurantStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update hours
            .addCase(updateRestaurantHours.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateRestaurantHours.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.restaurants = {
                    ...state.restaurants,
                    data: state.restaurants?.data?.map(restaurant =>
                        restaurant._id === action.payload.data._id ? action.payload.data : restaurant
                    ),
                };
                state.success = true;
                state.error = null;
            })
            .addCase(updateRestaurantHours.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Update bank details
            .addCase(updateBankDetails.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateBankDetails.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.restaurants = {
                    ...state.restaurants,
                    data: state.restaurants?.data?.map(restaurant =>
                        restaurant._id === action.payload.data._id ? action.payload.data : restaurant
                    ),
                };
                state.success = true;
                state.error = null;
            })
            .addCase(updateBankDetails.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { clearError, clearSuccess, setSelectedRestaurant, resetRestaurantState } = restaurantSlice.actions;
export default restaurantSlice.reducer;
