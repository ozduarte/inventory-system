function formatExpirationDate(dateValue) {
  if (!dateValue || typeof dateValue !== "string") {
    return "—";
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);

  if (!match) {
    return "—";
  }

  const [, year, month, day] = match;

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    12
  );

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return "—";
  }

  return date.toLocaleDateString();
}

function InventoryTable({ items, totalItems, onEditItem }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-5 py-3 font-medium">Item</th>
            <th className="px-5 py-3 font-medium">Quantity</th>
            <th className="px-5 py-3 font-medium">Threshold</th>
            <th className="px-5 py-3 font-medium">Location</th>
            <th className="px-5 py-3 font-medium">Expiration</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {items.map((item) => {
            const isLowStock = item.quantity < item.threshold;
            const expirationDate =
              item.expirationDate ?? item.expiration;

            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.category}
                  </p>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                  {item.quantity} {item.unit}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                  {item.threshold} {item.unit}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                  {item.location}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                  {formatExpirationDate(expirationDate)}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isLowStock
                        ? "bg-amber-50 text-amber-800"
                        : "bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    {isLowStock ? "Low stock" : "In stock"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onEditItem(item)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}

          {items.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center">
                <p className="font-medium text-gray-900">
                  No items found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try a different search term.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="border-t border-gray-200 px-5 py-3">
        <p className="text-sm text-gray-500">
          Showing {items.length} of {totalItems} items
        </p>
      </div>
    </div>
  );
}

export default InventoryTable;