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
