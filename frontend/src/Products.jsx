import { useEffect, useState, Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Dialog, Transition } from '@headlessui/react';
import { getPriceString } from "./util/getPriceString";
import apiAdapter from "./services/ApiAdapter";

// Add this helper function at the top level of your component
function isUserAdmin(user) {
  return user && (
    user.role === "ADMIN" || 
    user.role === "admin" || 
    (typeof user.isAdmin !== 'undefined' && user.isAdmin)
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("minimalUser") || "{}");

  // Effect to handle URL parameters for search and category
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    
    if (searchParam) {
      setSearchQuery(searchParam);
      searchProductsHandler(searchParam);
    } else if (categoryParam) {
      setSelectedCategory(categoryParam);
      fetchProductsByCategory(categoryParam);
    } else {
      setSearchQuery("");
      setSelectedCategory("");
      fetchProducts();
    }
  }, [location.search]);

  // Extract unique categories from products
  useEffect(() => {
    if (products.length > 0) {
      const allTags = products.flatMap(product => product.tags || []);
      const uniqueCategories = [...new Set(allTags)].filter(Boolean);
      setCategories(uniqueCategories);
    }
  }, [products]);

  // Force a re-check of admin status on component mount
  useEffect(() => {
    const loadAdminStatus = () => {
      try {
        const currentUser = localStorage.getItem("minimalUser");
        if (!currentUser) return false;
        
        const userData = JSON.parse(currentUser);
        console.log("Current user in Products:", userData);
        
        // Check if user is admin directly from localStorage
        if (isUserAdmin(userData)) {
          console.log("User is admin according to localStorage");
          setIsAdmin(true);
          return;
        }
      } catch (err) {
        console.error("Error checking local admin status:", err);
      }
    };
    
    loadAdminStatus();
    fetchProducts();
    checkAdminStatusFromBackend();
  }, []);

  const checkAdminStatusFromBackend = async () => {
    if (!user || !user.id) {
      console.log("No user ID available for admin check");
      return;
    }

    try {
      console.log("Checking admin status with backend for:", user.id);
      const result = await apiAdapter.checkAdminStatus(user.id);
      console.log("Backend admin check result:", result);
      
      if (result.isAdmin || result.role === "ADMIN") {
        setIsAdmin(true);
        
        // Update localStorage with admin role
        const updatedUser = { ...user, role: "ADMIN" };
        localStorage.setItem("minimalUser", JSON.stringify(updatedUser));
        console.log("Updated user in localStorage with admin role");
      }
    } catch (err) {
      console.error("Error checking admin status with backend:", err);
    }
  };

  const searchProductsHandler = async (query) => {
    try {
      setLoading(true);
      const data = await apiAdapter.searchProducts(query);
      setProducts(data || []);
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (category) => {
    try {
      setLoading(true);
      const data = await apiAdapter.getProductsByCategory(category);
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products by category:", err);
      setError("Failed to load products for this category");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiAdapter.getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleDeleteClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await apiAdapter.deleteProduct(productToDelete.id, user.id);
      toast.success("Product deleted successfully!");
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
      // Refresh the products list
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    }
  };
  
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-color section-title">
            {searchQuery ? `Search: "${searchQuery}"` : 
             selectedCategory ? `Category: ${selectedCategory}` : "Products"}
          </h1>
          
          {/* Debug info */}
          <div className="text-sm text-gray-700">
            User: {user ? user.username : "None"} | 
            Role: {user ? (user.role || "None") : "None"} | 
            Admin: {isAdmin ? "Yes" : "No"}
          </div>
          
          {isAdmin && (
            <Link 
              to="/add-product" 
              className="elegant-button bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Add Product
            </Link>
          )}
        </div>

        {/* Category filters */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === "" 
                  ? "bg-primary-color text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => navigate("/products")}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === category 
                    ? "bg-primary-color text-white" 
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4 text-lg">
              {searchQuery ? "No products found matching your search." : 
               selectedCategory ? "No products found in this category." : "No products available."}
            </p>
            {isAdmin && (
              <p className="text-gray-500">Click "Add Product" to create some!</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group elegant-card product-image-container relative">
                <Link to={`/product/${product.id}`}>
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
                
                {/* Make delete button always visible for admins */}
                {isAdmin && (
                  <button
                    onClick={(e) => handleDeleteClick(e, product)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md z-50"
                    aria-label="Delete product"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Transition.Root show={deleteConfirmOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setDeleteConfirmOpen}>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        Delete Product
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this product? This action cannot be undone.
                        </p>
                        {productToDelete && (
                          <div className="mt-2 p-2 border border-gray-200 rounded">
                            <p className="font-medium">{productToDelete.title}</p>
                            <p className="text-accent-color">{getPriceString(productToDelete.price)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setDeleteConfirmOpen(false);
                      setProductToDelete(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}