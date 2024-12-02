import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FoodCategories.css';

// Import food category images
import pizzaImg from '../../assets/images/categories/pizza.jpg';
import chickenImg from '../../assets/images/categories/chicken.jpg';
import burgerImg from '../../assets/images/categories/burger.jpg';
import thaliImg from '../../assets/images/categories/thali.jpg';
import biryaniImg from '../../assets/images/categories/biryani.jpg';

const categories = [
  { id: 1, name: 'Pizza', image: pizzaImg, slug: 'pizza' },
  { id: 2, name: 'Chicken', image: chickenImg, slug: 'chicken' },
  { id: 3, name: 'Burger', image: burgerImg, slug: 'burger' },
  { id: 4, name: 'Thali', image: thaliImg, slug: 'thali' },
  { id: 5, name: 'Biryani', image: biryaniImg, slug: 'biryani' },
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
              <img src={category.image} alt={category.name} />
            </div>
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCategories;
