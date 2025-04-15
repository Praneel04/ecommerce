import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import lottie from "lottie-web";
import orderPlaced from "./order-placed.json";

import { getPriceString } from "./util/getPriceString";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function ThankYou() {
  const query = useQuery();
  const orderId = query.get("orderId");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  let user = localStorage.getItem("minimalUser");
  if (user) user = JSON.parse(user);

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        // Setup animation
        lottie.loadAnimation({
          container: document.querySelector("#logo"),
          animationData: orderPlaced,
          renderer: "svg",
          loop: false,
          autoplay: true,
        });
        lottie.setSpeed(2);
        
        if (!user || !user.id) {
          setLoading(false);
          return;
        }
        
        const { data } = await axios.get(
          `http://localhost:8080/orders/${user.id}`
        );
        
        // Ensure data exists and is in the correct format
        const formattedOrders = Array.isArray(data) ? data.map(order => ({
          ...order,
          // Ensure totalCost exists, fall back to 0 if undefined
          totalCost: order.totalCost || 0
        })) : [];
        
        setOrders(formattedOrders);
        console.log("Orders loaded:", formattedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) getOrders();
  }, []);

  const handleDelete = async (order) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/orders/${order.id}`
      );
      toast.success(`Order deleted!`);
      setOrders(data);
    } catch (error) {
      console.log(error);
      toast.error("Error deleting order. Try again later");
    }
  };

  return (
    <div className="bg-light-color min-h-screen py-12">
      {orderId && (
        <>
          <div className="flex flex-row items-center mb-2">
            <div id="logo" className="mr-2 w-20 h-20"></div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary-color">
              Thank you!
            </h1>
          </div>

          <div className="text-2xl font-thin tracking-tight text-gray-600">
            Your #
            <span className="text-accent-color font-medium">
              {orderId.slice(orderId.length - 4, orderId.length).toUpperCase()}
            </span>{" "}
            order has been placed
          </div>
        </>
      )}

      <h1 className="text-3xl mt-20 mb-8 font-extrabold tracking-tight text-primary-color max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-title">
        Your Orders
      </h1>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">You don't have any orders yet.</p>
        </div>
      ) : (
        <div className="lg:flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {orders.map((order) => (
            <div
              className="lg:w-1/2 lg:mr-7 lg:mb-8 mt-7 mb-7 bg-white p-6 shadow rounded elegant-card"
              key={order.id}
            >
              <div className="flex items-center">
                {order.lineItems && order.lineItems[0] && order.lineItems[0].product ? (
                  <img
                    src={order.lineItems[0].product.images[0]}
                    alt={order.lineItems[0].product.title}
                    className="w-16 h-16 rounded-full flex flex-shrink-0 object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full flex flex-shrink-0 bg-gray-200"></div>
                )}
                <div className="flex items-start justify-between w-full">
                  <div className="pl-5 w-full">
                    <p className="text-xl font-medium leading-5 text-primary-color">
                      <span className="text-gray-400 mr-2">#{order.id}</span> 
                      <span className="font-playfair">Order</span>
                    </p>
                    <div className="mt-3 flex justify-between">
                      <div>
                        <p className="text-sm leading-normal pt-2 text-gray-500">
                          {order.createdAt ? (
                            new Date(order.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })
                          ) : 'Date not available'}
                        </p>
                        <p className="text-sm font-medium text-primary-color mt-1">
                          {order.lineItems ? `${order.lineItems.length} ${order.lineItems.length === 1 ? 'item' : 'items'}` : '0 items'}
                        </p>
                      </div>
                      <p className="font-bold text-lg text-accent-color">
                        {getPriceString(order.totalCost)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 hover:text-accent-color transition duration-300 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  onClick={() => handleDelete(order)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
