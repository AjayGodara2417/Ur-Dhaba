import React from 'react';
import './FoodCategories.css';

const categories = [
  {
    id: 1,
    name: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 2,
    name: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 3,
    name: 'North Indian',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 4,
    name: 'South Indian',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 5,
    name: 'Chinese',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 6,
    name: 'Desserts',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 7,
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 8,
    name: 'Healthy',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 9,
    name: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 10,
    name: 'Street Food',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80'
  }
];

const FoodCategories = () => {
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="food-categories">
      <button 
        className="scroll-button scroll-left" 
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        ←
      </button>
      <div className="categories-container" ref={scrollContainerRef}>
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <img 
              src={category.image} 
              alt={category.name}
              loading="lazy"
            />
            <div className="category-name">{category.name}</div>
          </div>
        ))}
      </div>
      <button 
        className="scroll-button scroll-right" 
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        →
      </button>
    </div>
  );
};

export default FoodCategories;
