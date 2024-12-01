import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    menu: [],
    categories: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchMenu = createAsyncThunk(
    'menu/fetchMenu',
    async (restaurantId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/restaurants/${restaurantId}/menu`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'menu/fetchCategories',
    async (restaurantId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/restaurants/${restaurantId}/categories`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addMenuItem = createAsyncThunk(
    'menu/addMenuItem',
    async ({ restaurantId, itemData }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/restaurants/${restaurantId}/menu`, itemData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateMenuItem = createAsyncThunk(
    'menu/updateMenuItem',
    async ({ restaurantId, itemId, itemData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `/api/restaurants/${restaurantId}/menu/${itemId}`,
                itemData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteMenuItem = createAsyncThunk(
    'menu/deleteMenuItem',
    async ({ restaurantId, itemId }, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/restaurants/${restaurantId}/menu/${itemId}`);
            return itemId;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const toggleItemAvailability = createAsyncThunk(
    'menu/toggleItemAvailability',
    async ({ restaurantId, itemId }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `/api/restaurants/${restaurantId}/menu/${itemId}/toggle-availability`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        clearMenu: (state) => {
            state.menu = [];
            state.categories = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Menu
            .addCase(fetchMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.menu = action.payload.menu;
            })
            .addCase(fetchMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch menu';
            })
            // Fetch Categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch categories';
            })
            // Add Menu Item
            .addCase(addMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMenuItem.fulfilled, (state, action) => {
                state.loading = false;
                state.menu.push(action.payload.menuItem);
            })
            .addCase(addMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to add menu item';
            })
            // Update Menu Item
            .addCase(updateMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMenuItem.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.menu.findIndex(item => item._id === action.payload.menuItem._id);
                if (index !== -1) {
                    state.menu[index] = action.payload.menuItem;
                }
            })
            .addCase(updateMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update menu item';
            })
            // Delete Menu Item
            .addCase(deleteMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMenuItem.fulfilled, (state, action) => {
                state.loading = false;
                state.menu = state.menu.filter(item => item._id !== action.payload);
            })
            .addCase(deleteMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete menu item';
            })
            // Toggle Item Availability
            .addCase(toggleItemAvailability.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleItemAvailability.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.menu.findIndex(item => item._id === action.payload.menuItem._id);
                if (index !== -1) {
                    state.menu[index] = action.payload.menuItem;
                }
            })
            .addCase(toggleItemAvailability.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to toggle item availability';
            });
    },
});

export const { clearMenu, clearError } = menuSlice.actions;
export default menuSlice.reducer;
