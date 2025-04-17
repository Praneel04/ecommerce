import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import apiAdapter from "./services/ApiAdapter";
import { getPriceString } from "./util/getPriceString";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("minimalUser") || "{}");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.id) {
        toast.error("Please log in to view orders");
        setLoading(false);
        return;
      }

      try {
        const data = await apiAdapter.getUserOrders(user.id);
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Could not load order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString || "Not available";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-10">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="elegant-box text-center py-10">
          <p className="text-lg text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link to="/products" className="elegant-button">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="elegant-box">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Order #{order.id.substring(order.id.length - 8)}
                </h2>
                <span className="text-sm text-gray-500">
                  Placed on {formatDate(order.orderDate)}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium text-accent-color">{getPriceString(order.totalCost)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Delivery Date:</span>
                  <span className="font-medium">{formatDate(order.deliveryDate)}</span>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Link 
                    to={`/thankyou?orderId=${order.id}`}
                    className="elegant-button-secondary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
