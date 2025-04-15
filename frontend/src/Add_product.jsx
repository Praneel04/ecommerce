import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/products", {
        title,
        description,
        price: Number(price),
        images: imageUrl.split(",").map(url => url.trim()),
        tags: tags.split(",").map(tag => tag.trim()),
        reviews: []
      });
      
      toast.success("Product added successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }
  };

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
          className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}