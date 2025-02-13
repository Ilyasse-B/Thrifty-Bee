import React, {useEffect, useState} from 'react';
import './home.css';
import Item from "./Item";

const Home = () => {
  const [products, setProducts] = useState([]); // State to store all fetched items
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filteredProducts, setFilteredProducts] = useState([]); // State for displayed products

  useEffect(() => {
    fetch("http://127.0.0.1:5000/listings") // Original fetch method
      .then(response => response.json())
      .then(data => {
        setProducts(data.listings); // Store fetched data in state
        setFilteredProducts(data.listings); // Initially show all products
      })
      .catch(error => console.error("Error fetching listings:", error));
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      // When search is empty, show all products
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => {
        return product && 
               product.listing_name && 
               typeof product.listing_name === 'string' &&
               product.listing_name.toLowerCase().includes(term.toLowerCase());
      });
      
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="home-container">
      {/* Search Title */}
      <h1 className="search-title">Search</h1>

      {/* Labels and Input Fields */}
      <div className="labels-container">
        {/* Search Section */}
        <div className="search-section">
          <span className="label">Search</span>
          <input type="text" className="search-box" placeholder="Search for items..." value={searchTerm} onChange={handleSearchChange} />
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <span className="label">Filters</span>
          <div className="filter-dropdowns">
            <select className="dropdown">
              <option>Category</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Books</option>
              <option>Other</option>
            </select>
            <select className="dropdown">
              <option>Price Range</option>
              <option>£0 - £10</option>
              <option>£10 - £50</option>
              <option>£50 - £100</option>
              <option>£100+</option>
            </select>
            <select className="dropdown">
              <option>Condition</option>
              <option>New</option>
              <option>Like New</option>
              <option>Used</option>
              <option>For Parts</option>
            </select>
          </div>
        </div>

        {/* Sort Section */}
        <div className="sort-section">
          <span className="label">Sort</span>
          <select className="dropdown">
            <option>Sort By</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>
      
      {/* Dynamic Product Display */}
      <div id="all-product-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Item 
              key={product.id || `item-${Math.random()}`} 
              id={product.id} 
              name={product.listing_name} 
              image={product.image} 
              price={product.price} 
            />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>

  );
};

export default Home;

