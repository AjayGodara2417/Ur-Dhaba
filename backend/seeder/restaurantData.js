const mongoose = require('mongoose');

const restaurants = [
    {
        name: "PizzaExpress",
        description: "Authentic Italian pizzas and fast food served fresh",
        cuisine: ["Italian", "Fast Food"],
        address: {
            street: "Guru Arjan Dev Nagar",
            city: "Ludhiana",
            state: "Punjab",
            zipCode: "141001",
            location: {
                type: "Point",
                coordinates: [75.8573, 30.9010]
            }
        },
        images: {
            cover: "/images/restaurants/pizzaexpress-cover.jpg",
            menu: ["/images/menu/pizza1.jpg", "/images/menu/pizza2.jpg"]
        },
        menu: [{
            name: "Margherita Pizza",
            description: "Classic pizza with tomato sauce and mozzarella",
            price: 299,
            category: "Pizza",
            image: "/images/menu/margherita.jpg",
            isVeg: true
        }],
        rating: 4.0,
        deliveryTime: {
            min: 50,
            max: 55
        },
        priceRange: {
            min: 200,
            max: 1000
        },
        isOpen: true,
        status: {
            online: true,
            acceptingOrders: true
        },
        documents: {
            panNumber: "ABCDE1234F",
            fssaiLicense: {
                number: "12345678901234",
                image: "/documents/fssai.jpg",
                expiryDate: new Date("2025-12-31")
            }
        },
        owner: new mongoose.Types.ObjectId(),
        stats: {
            totalOrders: 0,
            totalRatings: 0,
            averageRating: 0
        }
    },
    {
        name: "Ghee Indian Kitchen",
        description: "Authentic Indian cuisine with rich flavors",
        cuisine: ["Indian", "Home Food"],
        address: {
            street: "Chaura Bazar",
            city: "Ludhiana",
            state: "Punjab",
            zipCode: "141008",
            location: {
                type: "Point",
                coordinates: [75.8573, 30.9010]
            }
        },
        images: {
            cover: "/images/restaurants/ghee-indian-cover.jpg",
            menu: ["/images/menu/indian1.jpg", "/images/menu/indian2.jpg"]
        },
        menu: [{
            name: "Butter Chicken",
            description: "Creamy tomato-based curry with tender chicken",
            price: 399,
            category: "Main Course",
            image: "/images/menu/butter-chicken.jpg",
            isVeg: false
        }],
        rating: 3.5,
        deliveryTime: {
            min: 60,
            max: 65
        },
        priceRange: {
            min: 300,
            max: 1500
        },
        offers: [
            {
                title: "₹150 OFF ABOVE ₹999",
                description: "Get ₹150 off on orders above ₹999",
                code: "SAVE150",
                discountType: "FLAT",
                discountValue: 150,
                minOrder: 999
            }
        ],
        isOpen: true,
        status: {
            online: true,
            acceptingOrders: true
        },
        documents: {
            panNumber: "XYZAB5678G",
            fssaiLicense: {
                number: "98765432109876",
                image: "/documents/fssai.jpg",
                expiryDate: new Date("2025-12-31")
            }
        },
        owner: new mongoose.Types.ObjectId(),
        stats: {
            totalOrders: 0,
            totalRatings: 0,
            averageRating: 0
        }
    },
    {
        name: "Honey's Hygienic Food",
        description: "Clean and healthy food options",
        cuisine: ["Indian", "Snacks"],
        address: {
            street: "Chaura Bazar",
            city: "Ludhiana",
            state: "Punjab",
            zipCode: "141008",
            location: {
                type: "Point",
                coordinates: [75.8573, 30.9010]
            }
        },
        images: {
            cover: "/images/restaurants/honeys-cover.jpg",
            menu: ["/images/menu/snacks1.jpg", "/images/menu/snacks2.jpg"]
        },
        menu: [{
            name: "Samosa",
            description: "Crispy pastry filled with spiced potatoes",
            price: 30,
            category: "Snacks",
            image: "/images/menu/samosa.jpg",
            isVeg: true
        }],
        rating: 4.3,
        deliveryTime: {
            min: 60,
            max: 65
        },
        priceRange: {
            min: 100,
            max: 800
        },
        offers: [
            {
                title: "10% OFF ABOVE ₹350",
                description: "Get 10% off on orders above ₹350",
                code: "SAVE10",
                discountType: "PERCENTAGE",
                discountValue: 10,
                minOrder: 350
            }
        ],
        isOpen: true,
        status: {
            online: true,
            acceptingOrders: true
        },
        documents: {
            panNumber: "PQRST9012H",
            fssaiLicense: {
                number: "45678901234567",
                image: "/documents/fssai.jpg",
                expiryDate: new Date("2025-12-31")
            }
        },
        owner: new mongoose.Types.ObjectId(),
        stats: {
            totalOrders: 0,
            totalRatings: 0,
            averageRating: 0
        }
    }
];

module.exports = restaurants;
