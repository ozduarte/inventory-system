import { useState } from "react";

function InventoryItemForm({
  initialData,
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    category: initialData?.category ?? "",
    quantity: String(initialData?.quantity ?? ""),
    unit: initialData?.unit ?? "",
    threshold: String(initialData?.threshold ?? ""),
    location: initialData?.location ?? "",
    expiration:
      initialData?.expirationDate ??
      initialData?.expiration ??
      "",
  });

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
    setError("");

    const quantity = Number(formData.quantity);
    const threshold = Number(formData.threshold);

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.location ||
      !formData.unit ||
      formData.quantity.trim() === "" ||
      formData.threshold.trim() === ""
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

    onSubmit({
      name: formData.name.trim(),
      category: formData.category,
      quantity,
      unit: formData.unit,
      threshold,
      location: formData.location,
      expiration: formData.expiration || null,
      expirationDate: formData.expiration || null,
    });
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100";

  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="item-name" className={labelClass}>
          Item Name *
        </label>
        <input
          id="item-name"
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
          <label htmlFor="item-category" className={labelClass}>
            Category *
          </label>
          <select
            id="item-category"
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
          <label htmlFor="item-location" className={labelClass}>
            Storage Location *
          </label>
          <select
            id="item-location"
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
          <label htmlFor="item-quantity" className={labelClass}>
            Quantity *
          </label>
          <input
            id="item-quantity"
            name="quantity"
            type="number"
            min="0"
            step="any"
            value={formData.quantity}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="item-unit" className={labelClass}>
            Unit *
          </label>
          <select
            id="item-unit"
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
        <label htmlFor="item-threshold" className={labelClass}>
          Reorder Threshold *
        </label>
        <input
          id="item-threshold"
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
      </div>

      <div>
        <label htmlFor="item-expiration" className={labelClass}>
          Expiration Date (optional)
        </label>
        <input
          id="item-expiration"
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
          onClick={onCancel}
          className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default InventoryItemForm;