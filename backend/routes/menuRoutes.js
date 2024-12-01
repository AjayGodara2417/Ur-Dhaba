const express = require('express');
const {
    getMenus,
    getMenu,
    createMenu,
    updateMenu,
    deleteMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    addSpecialOffer
} = require('../controllers/menuController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getMenus);
router.get('/:id', getMenu);

// Protected routes
router.use(protect);
router.use(authorize('admin', 'restaurant'));

router
    .route('/')
    .post(createMenu);

router
    .route('/:id')
    .put(updateMenu)
    .delete(deleteMenu);

router
    .route('/:id/items')
    .post(addMenuItem);

router
    .route('/:id/items/:itemId')
    .put(updateMenuItem)
    .delete(deleteMenuItem);

router
    .route('/:id/items/:itemId/toggle')
    .patch(toggleItemAvailability);

router
    .route('/:id/offers')
    .post(addSpecialOffer);

module.exports = router;
