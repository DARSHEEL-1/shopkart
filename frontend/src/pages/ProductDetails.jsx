import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data.product);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  if (loading) return <p className="state-message">Loading product details...</p>;
  if (error) return <p className="state-message error">{error}</p>;
  if (!product) return <p className="state-message">Product not found.</p>;

  return (
    <div className="product-details-container">
      <Link to="/products" className="back-link">← Back to Products</Link>
      
      <div className="product-details-grid">
        <img src={product.image} alt={product.name} className="detail-image" />
        <div className="detail-info">
          <h1>{product.name}</h1>
          <span className="badge">{product.category}</span>
          <p className="price-large">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="description">{product.description}</p>
          <p className="stock-status">
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>
          <button className="add-to-cart-btn" disabled={product.stock === 0}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}