import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import apiAdapter from "./services/ApiAdapter";
import { getPriceString } from "./util/getPriceString";

export default function ThankYou() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      const params = new URLSearchParams(location.search);
      const orderId = params.get('orderId');
      
      if (!orderId) {
        toast.error("Order ID not found");
        setLoading(false);
        return;
      }
      
      try {
        const orderData = await apiAdapter.getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Could not load order details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [location]);
  
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Order not found</h1>
          <p className="mt-4 text-gray-500">We couldn't find the order you're looking for.</p>
          <Link to="/" className="mt-8 inline-block elegant-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  // Format the delivery date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString || "Not available";
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Thank you!</h1>
        <p className="mt-4 text-lg text-gray-500">
          Your order has been placed successfully.
        </p>
        <div className="mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">Order Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium">{formatDate(order.orderDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivery Date:</span>
              <span className="font-medium">{formatDate(order.deliveryDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shipping Address:</span>
              <span className="font-medium">{order.address}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium text-accent-color">{getPriceString(order.totalCost)}</span>
            </div>
          </div>
        </div>
        <Link to="/" className="mt-8 inline-block elegant-button">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
