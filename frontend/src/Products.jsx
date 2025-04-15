import axios from "axios";
import { useEffect, useState } from "react";
import NotFound from "./NotFound";
import { getPriceString } from "./util/getPriceString";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:8080/products");
        setProducts(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
      <p className="mt-4 text-gray-600">Loading products...</p>
    </div>
  );
  
  if (error) return <div className="text-center py-10 text-error-color">{error}</div>;

  return (
    <div className="bg-light-color min-h-screen">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl mb-10 font-extrabold tracking-tight text-primary-color section-title">
            Products
          </h1>
          
          <Link 
            to="/add-product" 
            className="elegant-button"
          >
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4 text-lg">No products available.</p>
            <p className="text-gray-500">Click "Add Product" to create some!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group elegant-card product-image-container"
              >
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={product.images && product.images[0] ? product.images[0] : "https://via.placeholder.com/300"}
                    alt={product.title}
                    className="w-full h-full object-center object-cover group-hover:opacity-90 transition duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mt-1 text-md font-medium text-gray-700">{product.title}</h3>
                  <p className="mt-2 text-xl font-bold text-accent-color">
                    {getPriceString(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}