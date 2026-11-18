
import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import { inventoryApi, ordersApi } from "../api";

function Home() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInventory() {
      try {
        const [inventoryData, orderData] = await Promise.all([
          inventoryApi.getAll(),
          ordersApi.getAll(),
        ]);

        setItems(inventoryData);
        setOrders(orderData);
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadInventory();

    window.addEventListener("inventory-updated", loadInventory);
    window.addEventListener("orders-updated", loadInventory);

    return () => {
      window.removeEventListener("inventory-updated", loadInventory);
      window.removeEventListener("orders-updated", loadInventory);
    };
  }, []);

  // Calculate low-stock items
  const lowStockItems = items.filter(
    (item) => Number(item.quantity) <= Number(item.threshold)
  );

  // Calculate items expiring within seven days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const expiringItems = items.filter((item) => {
    if (!item.expirationDate) return false;

    const expirationDate = new Date(
      `${item.expirationDate}T00:00:00`
    );

    return (
      expirationDate >= today &&
      expirationDate <= sevenDaysFromNow
    );
  });

  // Dashboard summary
  const inventorySummary = [
    {
      label: "Total inventory items",
      value: items.length,
      description: "Items currently tracked",
    },
    {
      label: "Low stock",
      value: lowStockItems.length,
      description: "Items needing attention",
    },
    {
      label: "Expiring soon",
      value: expiringItems.length,
      description: "Items expiring within 7 days",
    },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-12 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-7xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
      >
        Could not load dashboard: {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
      </div>

      {/* Inventory summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {inventorySummary.map((item) => (
          <SummaryCard
            key={item.label}
            title={item.label}
            value={item.value}
            description={item.description}
          />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low-stock items */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Low-stock items
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Items at or below their reorder threshold
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {lowStockItems.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500">
                No low-stock items.
              </p>
            ) : (
              lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Reorder threshold: {item.threshold} {item.unit}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800">
                    {item.quantity} {item.unit} left
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent orders */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Recent orders
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest reorder requests and deliveries
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-500">
                No orders have been added yet.
              </p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {order.supplier}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-800"
                        : order.status === "Ordered"
                        ? "bg-blue-50 text-blue-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
