import axios from 'axios';

// The ApiAdapter class serves as an adapter between your React components and the backend API
class ApiAdapter {
  constructor(baseURL = 'http://localhost:8080') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
    });
  }

  // User-related methods
  async login(username, password) {
    try {
      const { data } = await this.client.post('/login', { username, password });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async register(username, password, email) {
    try {
      const { data } = await this.client.post('/users', { username, password, email });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async checkAdminStatus(userId) {
    if (!userId) {
      console.log("No userId provided to checkAdminStatus");
      return { isAdmin: false };
    }
    
    // First check localStorage for cached admin status
    const cachedUser = localStorage.getItem("minimalUser");
    if (cachedUser) {
      try {
        const userData = JSON.parse(cachedUser);
        console.log("Checking cached user data:", userData);
        
        if (userData.role === "ADMIN") {
          console.log("User is admin according to cached data");
          return { isAdmin: true, role: "ADMIN" };
        }
      } catch (e) {
        console.error("Error parsing cached user:", e);
      }
    }
    
    // If not found in cache, check with backend
    try {
      console.log(`Checking admin status for user ${userId} with backend`);
      const response = await axios.get(`${this.baseURL}/users/${userId}/role`);
      console.log("Admin status response:", response.data);
      
      const isAdmin = response.data.isAdmin === true || 
                     (response.data.role && response.data.role.toUpperCase() === "ADMIN");
      
      if (isAdmin) {
        // Update localStorage with confirmed admin status
        const cachedUser = localStorage.getItem("minimalUser");
        if (cachedUser) {
          const userData = JSON.parse(cachedUser);
          userData.role = "ADMIN";
          localStorage.setItem("minimalUser", JSON.stringify(userData));
          console.log("Updated localStorage with admin role");
        }
      }
      
      return { 
        isAdmin: isAdmin, 
        role: isAdmin ? "ADMIN" : (response.data.role || "USER")
      };
    } catch (error) {
      console.error("Error checking admin status:", error);
      return { isAdmin: false };
    }
  }

  // Product-related methods
  async getProducts() {
    try {
      const { data } = await this.client.get('/products');
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getProduct(id) {
    try {
      const { data } = await this.client.get(`/products/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async addProductReview(productId, reviewData) {
    try {
      const { data } = await this.client.post(`/products/${productId}/review`, reviewData);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Product management methods (admin only)
  async addProduct(product, userId) {
    console.log(`Attempting to add product by user ${userId}`, product);
    try {
      const response = await axios.post(`${this.baseURL}/products?userId=${userId}`, product);
      console.log("Add product response:", response);
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  async updateProduct(id, product, userId) {
    const response = await axios.put(`${this.baseURL}/products/${id}?userId=${userId}`, product);
    return response.data;
  }

  async deleteProduct(id, userId) {
    try {
      console.log(`Attempting to delete product ${id} by user ${userId}`);
      const response = await axios.delete(`${this.baseURL}/products/${id}?userId=${userId}`);
      console.log("Delete product response:", response);
      return { success: true, id };
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Cart-related methods
  async getCart(userId) {
    try {
      const { data } = await this.client.get(`/cart/${userId}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async addToCart(userId, lineItem) {
    try {
      const { data } = await this.client.post('/cart', { userId, lineItem });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async removeFromCart(lineItemId, userId) {
    try {
      const { data } = await this.client.delete(`/cart/${lineItemId}?userId=${userId}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Order-related methods
  async placeOrder(cartId, address, deliveryDate) {
    try {
      const response = await axios.post(
        `${this.baseURL}/orders/${cartId}`,
        {
          address,
          deliveryDate
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  }

  async getUserOrders(userId) {
    try {
      const { data } = await this.client.get(`/orders/${userId}`);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiAdapter = new ApiAdapter();
export default apiAdapter;
