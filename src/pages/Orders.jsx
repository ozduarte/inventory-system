import { useEffect, useState } from "react";
import {
  ordersApi,
  orderItemsApi,
  inventoryApi,
} from "../api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [supplier, setSupplier] = useState("");
  const [status, setStatus] = useState("Requested");

  // Edit order form state
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editOrderNumber, setEditOrderNumber] = useState("");
  const [editSupplier, setEditSupplier] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingItem, setSavingItem] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  // New order item form state
  const [selectedInventoryItemId, setSelectedInventoryItemId] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");

  // Edit order item form state
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemQuantity, setEditItemQuantity] = useState("");
  const [editItemUnitCost, setEditItemUnitCost] = useState("");
  const [savingItemEdit, setSavingItemEdit] = useState(false);

  // Calculate the total cost of all items in the selected order
  const orderTotal = orderItems.reduce(
    (total, item) => total + Number(item.lineTotal || 0),
    0
  );

  // Load orders from PostgreSQL
  async function loadOrders() {
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Load available inventory items
  async function loadInventory() {
    try {
      const data = await inventoryApi.getAll();
      setInventoryItems(data);
    } catch (error) {
      setError(error.message);
    }
  }

  // Load items associated with a selected order
  async function handleViewItems(order) {
    setSelectedOrder(order);
    setOrderItems([]);
    setError("");
    setSuccessMessage("");

    try {
      const data = await orderItemsApi.getAll(order.id);
      setOrderItems(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    loadOrders();
    loadInventory();
  }, []);

  // Create a new order
  async function handleAddOrder(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const newOrder = await ordersApi.create({
        orderNumber,
        supplier,
        status,
      });

      setOrders((currentOrders) => [
        newOrder,
        ...currentOrders,
      ]);

      setOrderNumber("");
      setSupplier("");
      setStatus("Requested");

      setSuccessMessage("Order created successfully.");

      window.dispatchEvent(new Event("orders-updated"));
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  // Add an inventory item to the selected order
  async function handleAddOrderItem(event) {
    event.preventDefault();

    if (!selectedOrder) return;

    setSavingItem(true);
    setError("");
    setSuccessMessage("");

    try {
      await orderItemsApi.create(selectedOrder.id, {
        inventoryItemId: Number(selectedInventoryItemId),
        quantity: Number(itemQuantity),
        unitCost: unitCost === "" ? null : Number(unitCost),
      });

      // Reload the order items after adding one
      const updatedItems = await orderItemsApi.getAll(
        selectedOrder.id
      );

      setOrderItems(updatedItems);

      const updatedOrders = await ordersApi.getAll();
      setOrders(updatedOrders);

      // Reset the form
      setSelectedInventoryItemId("");
      setItemQuantity("");
      setUnitCost("");

      setSuccessMessage("Inventory item added to order successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setSavingItem(false);
    }
  }
// Remove an inventory item from an order
  async function handleRemoveOrderItem(itemId) {
    const confirmed = window.confirm(
        "Are you sure you want to remove this item from the order?"
    );

    if (!confirmed) return;

    setError("");
    setSuccessMessage("");

    try {
        await orderItemsApi.remove(selectedOrder.id, itemId);

        const updatedItems = await orderItemsApi.getAll(selectedOrder.id);
        setOrderItems(updatedItems);

        const updatedOrders = await ordersApi.getAll();
        setOrders(updatedOrders);

        setSuccessMessage("Item removed from order successfully.");
    } catch (error) {
        setError(error.message);
    }
  }
  // Start editing an order item
function handleEditOrderItem(item) {
    setEditingItemId(item.id);
    setEditItemQuantity(String(item.quantity));
    setEditItemUnitCost(
        item.unitCost == null ? "" : String(item.unitCost)
    );

    setError("");
    setSuccessMessage("");
}

// Save edited order item
  async function handleSaveOrderItemEdit(event) {
    event.preventDefault();

    if (!selectedOrder) return;

    setSavingItemEdit(true);
    setError("");
    setSuccessMessage("");

    try {
        await orderItemsApi.update(
            selectedOrder.id,
            editingItemId,
            {
                quantity: Number(editItemQuantity),
                unitCost:
                    editItemUnitCost === ""
                        ? null
                        : Number(editItemUnitCost),
            }
        );

        const updatedItems = await orderItemsApi.getAll(
            selectedOrder.id
        );

        setOrderItems(updatedItems);

        const updatedOrders = await ordersApi.getAll();
        setOrders(updatedOrders);

        setEditingItemId(null);
        setEditItemQuantity("");
        setEditItemUnitCost("");

        setSuccessMessage("Order item updated successfully.");
    } catch (error) {
        setError(error.message);
    } finally {
        setSavingItemEdit(false);
    }
  }
  // Update an order's status
  async function handleStatusChange(orderId, newStatus) {
      try {
          const updatedOrder = await ordersApi.updateStatus(
              orderId,
              newStatus
          );

          setOrders((currentOrders) =>
              currentOrders.map((order) =>
                  order.id === orderId ? updatedOrder : order
              )
          );

          if (newStatus === "Delivered") {
              await loadInventory();

              window.dispatchEvent(
                  new Event("inventory-updated")
              );
          }

          window.dispatchEvent(
              new Event("orders-updated")
          );

          setSuccessMessage("Order status updated successfully.");
      } catch (error) {
          setError(error.message);
      }
  }
  // Start editing an order
function handleEditOrder(order) {
    setEditingOrderId(order.id);
    setEditOrderNumber(order.orderNumber);
    setEditSupplier(order.supplier);

    setError("");
    setSuccessMessage("");
}

// Save edited order details
  async function handleSaveEdit(event) {
    event.preventDefault();

    setSavingEdit(true);
    setError("");
    setSuccessMessage("");

    try {
        const updatedOrder = await ordersApi.update(editingOrderId, {
            orderNumber: editOrderNumber,
            supplier: editSupplier,
        });

        setOrders((currentOrders) =>
            currentOrders.map((order) =>
                order.id === editingOrderId ? updatedOrder : order
            )
        );

        if (selectedOrder?.id === editingOrderId) {
            setSelectedOrder(updatedOrder);
        }

        setEditingOrderId(null);
        setEditOrderNumber("");
        setEditSupplier("");

        setSuccessMessage("Order details updated successfully.");

        window.dispatchEvent(new Event("orders-updated"));
    } catch (error) {
        setError(error.message);
    } finally {
        setSavingEdit(false);
    }
  }

  // Delete an order
  async function handleDeleteOrder(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    setError("");
    setSuccessMessage("");

    try {
      await ordersApi.remove(id);

      setOrders((currentOrders) =>
        currentOrders.filter((order) => order.id !== id)
      );

      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
        setOrderItems([]);
      }

      setSuccessMessage("Order deleted successfully.");

      window.dispatchEvent(new Event("orders-updated"));
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage supplier orders and deliveries.
        </p>
      </div>

      {/* Add order form */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 font-semibold text-gray-900">
          Create New Order
        </h2>

        <form onSubmit={handleAddOrder}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Order Number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(event) =>
                  setOrderNumber(event.target.value)
                }
                placeholder="ORD-004"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Supplier
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(event) =>
                  setSupplier(event.target.value)
                }
                placeholder="Supplier name"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Requested">Requested</option>
                <option value="Ordered">Ordered</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Create Order"}
              </button>
            </div>

          </div>
        </form>
      </section>

      {/* Messages */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {successMessage}
        </div>
      )}

    {/* Edit order form */}
    {editingOrderId !== null && (
    <section className="rounded-xl border border-yellow-200 bg-white p-6">
        <h2 className="mb-5 font-semibold text-gray-900">
            Edit Order
        </h2>

        <form onSubmit={handleSaveEdit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Order Number
                    </label>

                    <input
                        type="text"
                        value={editOrderNumber}
                        onChange={(event) =>
                            setEditOrderNumber(event.target.value)
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Supplier
                    </label>

                    <input
                        type="text"
                        value={editSupplier}
                        onChange={(event) =>
                            setEditSupplier(event.target.value)
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                </div>

            </div>

            <div className="mt-5 flex gap-3">
                <button
                    type="submit"
                    disabled={savingEdit}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {savingEdit ? "Saving..." : "Save Changes"}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setEditingOrderId(null);
                        setEditOrderNumber("");
                        setEditSupplier("");
                    }}
                    className="rounded-lg border border-gray-300 px-5 py-2 text-sm hover:bg-gray-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    </section>
    )}

      {/* Orders table */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            All Orders
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Orders stored in your PostgreSQL database.
          </p>
        </div>

        {loading ? (
          <p className="px-5 py-8 text-center text-sm text-gray-500">
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-500">
            No orders have been added yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-3 font-medium">
                    Order Number
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Supplier
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Order Date
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Status
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Order Total
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {order.orderNumber}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {order.supplier}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value
                          )
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="Requested">Requested</option>
                        <option value="Ordered">Ordered</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      ${Number(order.orderTotal || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewItems(order)}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          View Items
                        </button>
                        <button
                            type="button"
                            onClick={() => handleEditOrder(order)}
                            className="rounded-lg bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
                        >
                            Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Selected order items */}
      {selectedOrder && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Order Items
              </h2>
              <p className="text-sm text-gray-500">
                Order: {selectedOrder.orderNumber}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedOrder(null);
                setOrderItems([]);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
            >
              Close
            </button>
          </div>

          {/* Add inventory item form */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-4 font-semibold text-gray-800">
              Add Inventory Item
            </h3>

            {inventoryItems.length === 0 ? (
              <p className="text-sm text-gray-500">
                No inventory items are available. Add an item to your
                Inventory page first.
              </p>
            ) : (
              <form onSubmit={handleAddOrderItem}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Inventory Item
                    </label>
                    <select
                      value={selectedInventoryItemId}
                      onChange={(event) =>
                        setSelectedInventoryItemId(event.target.value)
                      }
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="">
                        Select an inventory item
                      </option>

                      {inventoryItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={itemQuantity}
                      onChange={(event) =>
                        setItemQuantity(event.target.value)
                      }
                      placeholder="Enter quantity"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Unit Cost (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={unitCost}
                      onChange={(event) =>
                        setUnitCost(event.target.value)
                      }
                      placeholder="0.00"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={savingItem}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingItem ? "Adding Item..." : "Add Item"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Display order items */}
          <h3 className="mb-3 font-semibold text-gray-800">
            Items in This Order
          </h3>

          {orderItems.length === 0 ? (
            <p className="text-gray-500">
              No inventory items have been added to this order yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b text-gray-500">
                    <th className="p-3">Item</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3">Unit Cost</th>
                    <th className="p-3">Line Total</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orderItems.map((item) => (
                    <>
                        <tr key={item.id} className="border-b">
                            <td className="p-3">{item.itemName}</td>

                            <td className="p-3">
                                {Number(item.quantity)}
                            </td>

                            <td className="p-3">{item.unit}</td>

                            <td className="p-3">
                                {item.unitCost == null
                                    ? "—"
                                    : `$${Number(item.unitCost).toFixed(2)}`}
                            </td>
                            <td className="p-3 font-medium text-gray-900">
                                ${Number(item.lineTotal).toFixed(2)}
                            </td>
                            <td className="p-3">
                                <div className="flex gap-2">
                                  {selectedOrder.status !== "Delivered" && (
                                      <>
                                          <button
                                              onClick={() => handleEditOrderItem(item)}
                                              className="text-blue-600 hover:text-blue-800 mr-3"
                                          >
                                              Edit
                                          </button>

                                          <button
                                              onClick={() => handleRemoveOrderItem(item.id)}
                                              className="text-red-600 hover:text-red-800"
                                          >
                                              Remove
                                          </button>
                                      </>
                                  )}
                                </div>
                            </td>
                        </tr>

                        {editingItemId === item.id && (
                            <tr key={`${item.id}-edit`} className="border-b bg-gray-50">
                                <td colSpan="6" className="p-4">
                                    <form
                                        onSubmit={handleSaveOrderItemEdit}
                                        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                                    >
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Quantity
                                            </label>

                                            <input
                                                type="number"
                                                step="0.001"
                                                min="0.001"
                                                value={editItemQuantity}
                                                onChange={(event) =>
                                                    setEditItemQuantity(event.target.value)
                                                }
                                                required
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Unit Cost
                                            </label>

                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={editItemUnitCost}
                                                onChange={(event) =>
                                                    setEditItemUnitCost(event.target.value)
                                                }
                                                placeholder="Optional"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                            />
                                        </div>

                                        <div className="flex items-end gap-2">
                                            <button
                                                type="submit"
                                                disabled={savingItemEdit}
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {savingItemEdit ? "Saving..." : "Save Changes"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingItemId(null);
                                                    setEditItemQuantity("");
                                                    setEditItemUnitCost("");
                                                }}
                                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                        )}
                    </>
                ))}
                </tbody>
              </table>
              {/* Overall Order Total */}
              <div className="mt-5 flex justify-end">
                  <div className="rounded-lg bg-gray-50 px-6 py-4">
                      <p className="text-sm font-medium text-gray-500">
                          Overall Order Total
                      </p>

                      <p className="mt-1 text-2xl font-bold text-gray-900">
                          ${orderTotal.toFixed(2)}
                      </p>
                  </div>
              </div>
            </div>
          )}

        </section>
      )}

    </div>
  );
}

export default Orders;
