import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FoodCategories.css';

const categories = [
  { 
    id: 1, 
    name: 'Pizza', 
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&h=300&q=80',
    slug: 'pizza' 
  },
  { 
    id: 2, 
    name: 'Chicken', 
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=300&h=300&q=80',
    slug: 'chicken' 
  },
  { 
    id: 3, 
    name: 'Burger', 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&h=300&q=80',
    slug: 'burger' 
  },
  { 
    id: 4, 
    name: 'Thali', 
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&h=300&q=80',
    slug: 'thali' 
  },
  { 
    id: 5, 
    name: 'Biryani', 
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&h=300&q=80',
    slug: 'biryani' 
  },
];

const FoodCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <div className="food-categories">
      <div className="categories-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => handleCategoryClick(category.slug)}
          >
            <div className="category-image-container">
              <img 
                src={category.image} 
                alt={category.name}
                loading="lazy"
              />
            </div>
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCategories;
