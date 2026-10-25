import { useState } from "react";

const initialFormData = {
  name: "",
  category: "",
  quantity: "",
  unit: "",
  threshold: "",
  location: "",
  expiration: "",
};

function AddItemModal({ onClose, onAddItem }) {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const quantity = Number(formData.quantity);
    const threshold = Number(formData.threshold);

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.location ||
      !formData.unit ||
      formData.quantity === "" ||
      formData.threshold === ""
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (
      !Number.isFinite(quantity) ||
      !Number.isFinite(threshold) ||
      quantity < 0 ||
      threshold < 0
    ) {
      setError(
        "Quantity and threshold must be valid non-negative numbers."
      );
      return;
    }

    onAddItem({
      id: Date.now(),
      name: formData.name.trim(),
      category: formData.category,
      quantity,
      unit: formData.unit,
      threshold,
      location: formData.location,
      expiration: formData.expiration || null,
    });
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100";

  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-item-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="add-item-title"
              className="text-xl font-bold text-gray-900"
            >
              Add Inventory Item
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the details for your new inventory item.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg px-2 py-1 text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Item Name *
            </label>

            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Chicken breast"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className={labelClass}>
                Category *
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select category</option>
                <option value="Meat">Meat</option>
                <option value="Dairy">Dairy</option>
                <option value="Produce">Produce</option>
                <option value="Pantry">Pantry</option>
                <option value="Baking">Baking</option>
                <option value="Seafood">Seafood</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>
                Storage Location *
              </label>

              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select location</option>
                <option value="Refrigerator">Refrigerator</option>
                <option value="Freezer">Freezer</option>
                <option value="Pantry shelf">Pantry shelf</option>
                <option value="Storage room">Storage room</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="quantity" className={labelClass}>
                Current Quantity *
              </label>

              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="any"
                value={formData.quantity}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 10"
                required
              />
            </div>

            <div>
              <label htmlFor="unit" className={labelClass}>
                Unit *
              </label>

              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select unit</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="L">Liters (L)</option>
                <option value="mL">Milliliters (mL)</option>
                <option value="units">Units</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="threshold" className={labelClass}>
              Reorder Threshold *
            </label>

            <input
              id="threshold"
              name="threshold"
              type="number"
              min="0"
              step="any"
              value={formData.threshold}
              onChange={handleChange}
              className={inputClass}
              placeholder="Minimum quantity before restocking"
              required
            />

            <p className="mt-1 text-xs text-gray-500">
              The item will be marked low stock when its quantity is at or
              below this level, depending on your inventory status logic.
            </p>
          </div>

          <div>
            <label htmlFor="expiration" className={labelClass}>
              Expiration Date (optional)
            </label>

            <input
              id="expiration"
              name="expiration"
              type="date"
              value={formData.expiration}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
            >
              Add Item
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddItemModal;