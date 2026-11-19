const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Reusable function for communicating with Express
async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    // Handle unsuccessful responses
    if (!response.ok) {
        let errorMessage = "Something went wrong.";

        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch {
            // Use the default error message
        }

        throw new Error(errorMessage);
    }

    // DELETE requests return no response body
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// Inventory API operations
export const inventoryApi = {
    // Retrieve all inventory items
    getAll() {
        return request("/inventory");
    },

    // Add an inventory item
    create(item) {
        return request("/inventory", {
            method: "POST",
            body: JSON.stringify(item),
        });
    },

    // Update an existing inventory item
    update(id, item) {
        return request(`/inventory/${id}`, {
            method: "PUT",
            body: JSON.stringify(item),
        });
    },

    // Delete an inventory item
    remove(id) {
        return request(`/inventory/${id}`, {
            method: "DELETE",
        });
    },
};

// Orders API operations
export const ordersApi = {
    getAll() {
        return request("/orders");
    },

    create(order) {
        return request("/orders", {
            method: "POST",
            body: JSON.stringify(order),
        });
    },

    updateStatus(id, status) {
        return request(`/orders/${id}`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        });
    },

    update(id, order) {
        return request(`/orders/${id}`, {
            method: "PUT",
            body: JSON.stringify(order),
        });
    },

    remove(id) {
        return request(`/orders/${id}`, {
            method: "DELETE",
        });
    },
};

// Order items API operations
export const orderItemsApi = {
    getAll(orderId) {
        return request(`/order-items/${orderId}`);
    },

    create(orderId, item) {
        return request(`/order-items/${orderId}`, {
            method: "POST",
            body: JSON.stringify(item),
        });
    },

    update(orderId, itemId, item) {
        return request(`/order-items/${orderId}/${itemId}`, {
            method: "PUT",
            body: JSON.stringify(item),
        });
    },

    remove(orderId, itemId) {
        return request(`/order-items/${orderId}/${itemId}`, {
            method: "DELETE",
        });
    },
};
