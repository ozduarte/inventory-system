
import { useEffect, useState } from "react";
import { inventoryItems } from "../mockData";
import InventorySearch from "../components/InventorySearch";
import InventoryTable from "../components/InventoryTable";
import AddItemModal from "../components/AddItemModal";

function Inventory() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(() => inventoryItems);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  const filteredItems = items.filter((item) =>
    `${item.name} ${item.category} ${item.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function handleAddItem(newItem) {
    setItems((previousItems) => [...previousItems, newItem]);
    setIsAddModalOpen(false);

    setSuccessMessage(
      `${newItem.name} has been added to your inventory.`
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="self-start whitespace-nowrap rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
        >
          + Add Item
        </button>
      </div>

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          <p>{successMessage}</p>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
            className="rounded px-2 py-1 hover:bg-emerald-100"
          >
            &times;
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <InventorySearch
          search={search}
          onSearchChange={setSearch}
        />

        <InventoryTable
          items={filteredItems}
          totalItems={items.length}
        />
      </section>

      {isAddModalOpen && (
        <AddItemModal
          onClose={() => setIsAddModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}
    </div>
  );
}

export default Inventory;
