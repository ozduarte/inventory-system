import InventoryItemForm from "./InventoryItemForm";

function AddItemModal({ onClose, onAddItem }) {
  function handleSubmit(formData) {
    const newItem = {
      ...formData,
      id: Date.now(),
    };

    onAddItem(newItem);
  }

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
            <h2 id="add-item-title" className="text-xl font-bold text-gray-900">
              Add Inventory Item
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter the details for the new item.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="cursor-pointer rounded-lg px-2 py-1 text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            &times;
          </button>
        </div>

        <InventoryItemForm
          initialData={null}
          submitLabel="Add Item"
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </section>
    </div>
  );
}

export default AddItemModal;