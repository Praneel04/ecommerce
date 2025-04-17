import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./HomePage";
import Product from "./Product";
import NavBar from "./NavBar";
import Checkout from "./Checkout";
import ThankYou from "./ThankYou";
import AddProduct from "./Add_product";
import Products from "./Products";
import About from "./About";
import OrdersPage from "./OrdersPage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiAdapter from "./services/ApiAdapter";
import { checkAndFixUserData } from './utils/userHelper';

// Admin route guard component with backend verification
const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      // Try to get user from localStorage first
      let user = localStorage.getItem("minimalUser");
      if (!user) {
        console.log("No user found in localStorage");
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      try {
        user = JSON.parse(user);
        console.log("User from localStorage:", user);
        
        // Force uppercase comparison for role
        if (user.role && user.role.toUpperCase() === "ADMIN") {
          console.log("Admin role found in localStorage");
          setIsAdmin(true);
          setIsLoading(false);
          return;
        }
        
        // If not, verify with backend
        console.log("Verifying admin status with backend for ID:", user.id);
        const result = await apiAdapter.checkAdminStatus(user.id);
        console.log("Admin status check result:", result);
        
        const isAdminUser = result.isAdmin || (result.role && result.role.toUpperCase() === "ADMIN");
        
        if (isAdminUser) {
          console.log("User is admin according to backend");
          setIsAdmin(true);
          
          // Update localStorage - force ADMIN in uppercase
          const updatedUser = { ...user, role: "ADMIN" };
          localStorage.setItem("minimalUser", JSON.stringify(updatedUser));
        } else {
          console.log("User is not admin according to backend");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error during admin verification:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
        <p className="mt-4 text-gray-600">Checking permissions...</p>
      </div>
    );
  }
  
  if (!isAdmin) {
    toast.error("Admin access required");
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const [userChecked, setUserChecked] = useState(false);
  
  // Run once on app start to fix any user data issues
  useEffect(() => {
    const fixUserData = async () => {
      await checkAndFixUserData(apiAdapter);
      setUserChecked(true);
    };
    
    fixUserData();
  }, []);

  return (
    <>
      <NavBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/about" element={<About />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route 
            path="/add-product" 
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            } 
          />
        </Routes>
      </NavBar>
      <ToastContainer />
    </>
  );
}

export default App;
