
import { useState } from "react";

function UpdateQuantityModal({ item, onClose, onUpdateQuantity }) {
  const [operation, setOperation] = useState("add");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const amount = Number(quantity);

    if (quantity.trim() === "" || !Number.isFinite(amount)) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (amount < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    if (operation !== "set" && amount === 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    if (operation === "remove" && amount > item.quantity) {
      setError(
        `You only have ${item.quantity} ${item.unit} available.`
      );
      return;
    }

    let newQuantity;

    if (operation === "add") {
      newQuantity = item.quantity + amount;
    } else if (operation === "remove") {
      newQuantity = item.quantity - amount;
    } else {
      newQuantity = amount;
    }

    onUpdateQuantity(item.id, newQuantity);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-quantity-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="update-quantity-title"
              className="text-xl font-bold text-gray-900"
            >
              Update quantity
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {item.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg px-2 py-1 text-xl text-gray-500 hover:bg-gray-100 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="mb-5 rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Current quantity
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {item.quantity} {item.unit}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Low-stock threshold: {item.threshold} {item.unit}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="quantity-operation"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Operation
            </label>

            <select
              id="quantity-operation"
              value={operation}
              onChange={(event) => {
                setOperation(event.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="add">Add stock</option>
              <option value="remove">Remove stock</option>
              <option value="set">Set quantity</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="quantity-amount"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {operation === "set"
                ? `New quantity (${item.unit})`
                : `Amount to ${operation === "add" ? "add" : "remove"} (${item.unit})`}
            </label>

            <input
              id="quantity-amount"
              type="number"
              min="0"
              step="any"
              value={quantity}
              onChange={(event) => {
                setQuantity(event.target.value);
                setError("");
              }}
              placeholder="Enter quantity"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "quantity-error" : undefined}
              autoFocus
            />
          </div>

          {error && (
            <p
              id="quantity-error"
              role="alert"
              className="text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateQuantityModal;