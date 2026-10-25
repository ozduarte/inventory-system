
import { useState } from "react";
import { inventoryItems } from "../mockData";
import InventorySearch from "../components/InventorySearch";
import InventoryTable from "../components/InventoryTable";

function Inventory() {
  const [search, setSearch] = useState("");

  const filteredItems = inventoryItems.filter((item) =>
    `${item.name} ${item.category} ${item.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
          disabled
          title="Adding items will be implemented next"
          className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white opacity-70 self-start whitespace-nowrap rounded-lg"
        >
          + Add Item
        </button>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <InventorySearch
          search={search}
          onSearchChange={setSearch}
        />

        <InventoryTable
          items={filteredItems}
          totalItems={inventoryItems.length}
        />
      </section>
    </div>
  );
}

export default Inventory;
