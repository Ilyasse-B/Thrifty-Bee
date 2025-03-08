import React, {useEffect, useState} from 'react';
import './home.css';
import Item from "./Item";

// Helper function moved outside the component
const getPriceRangeValues = (range) => {
  switch (range) {
    case '£0 - £10': return [0, 10];
    case '£10 - £50': return [10, 50];
    case '£50 - £100': return [50, 100];
    case '£100+': return [100, Infinity];
    default: return [0, Infinity];
  }
};

const Home = () => {
  const [products, setProducts] = useState([]); // State to store all fetched items
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filteredProducts, setFilteredProducts] = useState([]); // State for displayed products
  const [priceRange, setPriceRange] = useState('Price Range'); // State for price range filter
  const [sortOrder, setSortOrder] = useState('Sort By'); // State for sorting order
  const [category, setCategory] = useState('Category'); //State for category filter
  const [condition, setCondition] = useState('Condition'); //State for condition filter

  useEffect(() => {
    fetch("http://127.0.0.1:5000/listings")
      .then(response => response.json())
      .then(data => {
        setProducts(data.listings); // Store fetched data in state
        setFilteredProducts(data.listings); // Initially show all products
      })
      .catch(error => console.error("Error fetching listings:", error));
  }, []);

  // Filter and sort products
  const filterAndSortProducts = () => {
    let result = [...products];
    
    // Exclude sold and pending items
    result = result.filter(product => !product.sold && !product.pending);

    // Apply search filter
    if (searchTerm.trim() !== '') {
      result = result.filter(product => {
        return product && 
               product.listing_name && 
               typeof product.listing_name === 'string' &&
               product.listing_name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    // Apply price range filter
    if (priceRange !== 'Price Range') {
      const [min, max] = getPriceRangeValues(priceRange);
      result = result.filter(product => {
        return product && 
               product.price !== undefined && 
               product.price >= min && 
               (max === Infinity || product.price <= max);
      });
    }

    //Apply category filter
    if (category !== 'Category'){
      result = result.filter(product => {
        return product &&
              product.category &&
              product.category == category;
      });
    }

    //Apply condition filter
    if (condition !== 'Condition') {
      result = result.filter(product => {
        return product && 
               product.condition && 
               product.condition === condition;
      });
    }

    // Apply sorting
    if (sortOrder === 'Price: Low to High') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === 'Price: High to Low') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    
    setFilteredProducts(result);
  };

  // Apply filters whenever search term or price range changes
  useEffect(() => {
    if (products.length > 0) {
      filterAndSortProducts();
    }
  }, [searchTerm, priceRange, sortOrder, category, condition]); // Respond to changes in search or price range

  useEffect(() => {
    // When products are loaded, apply any existing filters
    if (products.length > 0) {
      filterAndSortProducts();
    }
  }, [products]); // Respond to changes in products

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  // Handle price range change
  const handlePriceRangeChange = (e) => {
    const range = e.target.value;
    setPriceRange(range);
  };

    // Handle sort order change
    const handleSortOrderChange = (e) => {
      const order = e.target.value;
      setSortOrder(order);
    };

    //Handle category change
    const handleCategoryChange = (e) => {
      const selectedCategory = e.target.value;
      setCategory(selectedCategory);
    };

    //Handle condition change
    const handleConditionChange = (e) => {
      const selectedCondition = e.target.value;
      setCondition(selectedCondition);
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
            <select className="dropdown"
              value={category}
              onChange={handleCategoryChange}>
              <option>Category</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Books</option>
              <option>Other</option>
            </select>
            <select 
              className="dropdown"
              value={priceRange}
              onChange={handlePriceRangeChange}
            >
              <option>Price Range</option>
              <option>£0 - £10</option>
              <option>£10 - £50</option>
              <option>£50 - £100</option>
              <option>£100+</option>
            </select>
            <select 
              className="dropdown"
              value={condition}
              onChange={handleConditionChange}>
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
          <select 
            className="dropdown"
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
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
              category={product.category} 
              condition={product.condition} 
              description={product.description}
              user_id = {product.user_id}
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

