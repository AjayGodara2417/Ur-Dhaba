import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    restaurantId: null,
    total: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const { restaurantId, item } = action.payload;
            
            // If adding item from different restaurant, clear cart
            if (state.restaurantId && state.restaurantId !== restaurantId) {
                state.items = [];
                state.total = 0;
            }
            
            state.restaurantId = restaurantId;
            
            const existingItem = state.items.find(i => i._id === item._id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...item, quantity: 1 });
            }
            
            state.total = state.items.reduce((total, item) => 
                total + (item.price * item.quantity), 0);
        },
        removeItem: (state, action) => {
            const itemId = action.payload;
            const existingItem = state.items.find(item => item._id === itemId);
            
            if (existingItem) {
                if (existingItem.quantity === 1) {
                    state.items = state.items.filter(item => item._id !== itemId);
                } else {
                    existingItem.quantity -= 1;
                }
                
                state.total = state.items.reduce((total, item) => 
                    total + (item.price * item.quantity), 0);
                
                if (state.items.length === 0) {
                    state.restaurantId = null;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.restaurantId = null;
            state.total = 0;
        },
        updateItemQuantity: (state, action) => {
            const { itemId, quantity } = action.payload;
            const item = state.items.find(item => item._id === itemId);
            
            if (item) {
                if (quantity > 0) {
                    item.quantity = quantity;
                } else {
                    state.items = state.items.filter(item => item._id !== itemId);
                }
                
                state.total = state.items.reduce((total, item) => 
                    total + (item.price * item.quantity), 0);
                
                if (state.items.length === 0) {
                    state.restaurantId = null;
                }
            }
        }
    }
});

export const { addItem, removeItem, clearCart, updateItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;
