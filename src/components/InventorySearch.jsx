function InventorySearch({ search, onSearchChange }) {
  return (
    <div className="border-b border-gray-200 p-4">
      <label
        htmlFor="inventory-search"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Search inventory
      </label>

      <input
        id="inventory-search"
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by item, category, or location..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

export default InventorySearch;