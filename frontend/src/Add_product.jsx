import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import apiAdapter from "./services/ApiAdapter";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem("minimalUser") || "{}");
  
  // Check admin status directly with backend
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!user || !user.id) {
        setIsAdmin(false);
        setIsChecking(false);
        toast.error("You must be logged in");
        navigate("/");
        return;
      }
      
      try {
        console.log("Verifying admin status for:", user.id);
        const result = await apiAdapter.checkAdminStatus(user.id);
        console.log("Admin verification result:", result);
        setIsAdmin(result.isAdmin);
        setIsChecking(false);
        
        if (!result.isAdmin) {
          toast.error("Admin access required");
          navigate("/");
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
        setIsAdmin(false);
        setIsChecking(false);
        toast.error("Error verifying permissions");
        navigate("/");
      }
    };
    
    verifyAdminStatus();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error("Only administrators can add products");
      return;
    }
    
    try {
      setIsLoading(true);
      const productData = {
        name: title, // Make sure backend expects this field
        title: title, // Keep title for frontend display
        description,
        price: Number(price),
        images: imageUrl.split(",").map(url => url.trim()),
        tags: tags.split(",").map(tag => tag.trim()),
        reviews: []
      };
      
      console.log("Submitting product data:", productData);
      await apiAdapter.addProduct(productData, user.id);
      toast.success("Product added successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
        <p className="mt-4 text-gray-600">Checking permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-12 sm:px-6">
      <h1 className="text-4xl mb-10 font-extrabold tracking-tight text-gray-900">Add Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={4}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URLs (comma separated)</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="shirt, cotton, blue"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
