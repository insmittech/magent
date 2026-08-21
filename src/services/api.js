const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('magnet_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.message) || response.statusText || 'API request failed';
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth endpoints
  auth: {
    register: async (payload) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('magnet_token', data.token);
      }
      return data;
    },
    login: async (payload) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('magnet_token', data.token);
      }
      return data;
    },
    logout: () => {
      localStorage.removeItem('magnet_token');
    },
    getMe: async () => {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  // Products endpoints
  products: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_URL}/products?${query}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    create: async (formData) => {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getHeaders(true), // multipart/form-data
        body: formData
      });
      return handleResponse(res);
    },
    update: async (id, formData) => {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(true), // multipart/form-data
        body: formData
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  // Categories endpoints
  categories: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    create: async (payload) => {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    update: async (id, payload) => {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  // Orders endpoints
  orders: {
    place: async (payload) => {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    getMy: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_URL}/orders/my?${query}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    getAdminAll: async () => {
      const res = await fetch(`${API_URL}/orders/admin`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    updateStatus: async (id, payload) => {
      const res = await fetch(`${API_URL}/orders/admin/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    }
  },

  // Users profiles endpoints
  users: {
    saveAddress: async (payload) => {
      const res = await fetch(`${API_URL}/users/addresses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    deleteAddress: async (id) => {
      const res = await fetch(`${API_URL}/users/addresses/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    toggleWishlist: async (productId) => {
      const res = await fetch(`${API_URL}/users/wishlist/${productId}`, {
        method: 'POST',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  // Banners endpoints
  banners: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/banners`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    create: async (payload) => {
      const res = await fetch(`${API_URL}/banners`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    update: async (id, payload) => {
      const res = await fetch(`${API_URL}/banners/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/banners/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  // Settings endpoints
  settings: {
    get: async () => {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    update: async (payload) => {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    }
  },

  // Payments endpoints
  payments: {
    createRazorpayOrder: async (amount) => {
      const res = await fetch(`${API_URL}/payments/razorpay/order`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ amount })
      });
      return handleResponse(res);
    },
    verifyRazorpayPayment: async (payload) => {
      const res = await fetch(`${API_URL}/payments/razorpay/verify`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    }
  }
};
