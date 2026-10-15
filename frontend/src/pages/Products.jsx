import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts(search, category);
        setProducts(data.products);
      } catch (err) {
        setError('Something went wrong while loading products.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search requests slightly for better UX
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="products-page">
      <h2>Product Catalog</h2>
      
      <div className="filters-container">
        <SearchBar search={search} setSearch={setSearch} />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All Categories">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
        </select>
      </div>

      {loading && <p className="state-message">Loading products...</p>}
      {error && <p className="state-message error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="state-message">No products found.</p>
      )}

      <div className="product-grid">
        {!loading && !error && products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}