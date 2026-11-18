import { useEffect, useState } from "react";
import { inventoryApi } from "../api";
import InventorySearch from "../components/InventorySearch";
import InventoryTable from "../components/InventoryTable";
import AddItemModal from "../components/AddItemModal";
import EditItemModal from "../components/EditItemModal";

function Inventory() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve inventory from PostgreSQL when the page loads
  useEffect(() => {
    async function loadInventory() {
      try {
        setLoading(true);
        const data = await inventoryApi.getAll();
        setItems(data);
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadInventory();
  }, []);

  // Automatically dismiss success messages
  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  // Search inventory
  const filteredItems = items.filter((item) =>
    `${item.name} ${item.category} ${item.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Add inventory item to PostgreSQL
  async function handleAddItem(newItem) {
    try {
      const savedItem = await inventoryApi.create(newItem);

      setItems((previousItems) => [
        ...previousItems,
        savedItem,
      ]);

      window.dispatchEvent(new Event("inventory-updated"));

      setIsAddModalOpen(false);
      setError("");

      setSuccessMessage(
        `${savedItem.name} has been added to your inventory.`
      );
    } catch (error) {
      setError(error.message);
    }
  }

  // Open edit modal
  function handleEditItem(item) {
    setItemToEdit(item);
  }

  // Save changes to PostgreSQL
  async function handleSaveEdit(updatedItem) {
    try {
      const savedItem = await inventoryApi.update(
        updatedItem.id,
        updatedItem
      );

      setItems((previousItems) =>
        previousItems.map((item) =>
          item.id === savedItem.id ? savedItem : item
        )
      );

      window.dispatchEvent(new Event("inventory-updated"));

      setItemToEdit(null);
      setError("");

      setSuccessMessage(
        `${savedItem.name} has been updated successfully.`
      );
    } catch (error) {
      setError(error.message);
    }
  }

  // Delete inventory item from PostgreSQL
  async function handleDeleteItem(itemId) {
    const deletedItem = items.find(
      (item) => item.id === itemId
    );

    if (!deletedItem) return;

    try {
      await inventoryApi.remove(itemId);

      setItems((previousItems) =>
        previousItems.filter((item) => item.id !== itemId)
      );

      window.dispatchEvent(new Event("inventory-updated"));

      setItemToEdit(null);
      setError("");

      setSuccessMessage(
        `${deletedItem.name} has been deleted from your inventory.`
      );
    } catch (error) {
      setError(error.message);
    }
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

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="px-5 py-12 text-center text-gray-500">
            Loading inventory...
          </div>
        ) : (
          <>
            <InventorySearch
              search={search}
              onSearchChange={setSearch}
            />

            <InventoryTable
              items={filteredItems}
              totalItems={items.length}
              onEditItem={handleEditItem}
            />
          </>
        )}
      </section>

      {isAddModalOpen && (
        <AddItemModal
          onClose={() => setIsAddModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}

      {itemToEdit && (
        <EditItemModal
          item={itemToEdit}
          onClose={() => setItemToEdit(null)}
          onSave={handleSaveEdit}
          onDelete={handleDeleteItem}
        />
      )}
    </div>
  );
}

export default Inventory;
