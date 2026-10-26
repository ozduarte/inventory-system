import InventoryItemForm from "./InventoryItemForm";

function EditItemModal({ item, onClose, onSave, onDelete }) {
  function handleSubmit(formData) {
    onSave({
      ...item,
      ...formData,
    });
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`
    );

    if (confirmed) {
      onDelete(item.id);
    }
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
        aria-labelledby="edit-item-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="edit-item-title"
              className="text-xl font-bold text-gray-900"
            >
              Edit Inventory Item
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the details for {item.name}.
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
          initialData={item}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={onClose}
        />

        <div className="mt-4 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={handleDelete}
            className="w-full cursor-pointer rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Item
          </button>
        </div>
      </section>
    </div>
  );
}

export default EditItemModal;