import SummaryCard from "../components/SummaryCard";
import {
  inventorySummary,
  lowStockItems,
  recentOrders,
} from "../mockData";

function Home() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
      </div>

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
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Low-stock items
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Items below their reorder threshold
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {lowStockItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Reorder threshold: {item.threshold}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800">
                  {item.quantity} left
                </span>
              </div>
            ))}
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
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">
                    {order.id}
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;