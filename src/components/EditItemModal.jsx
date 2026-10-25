import InventoryItemForm from "./InventoryItemForm";

function EditItemModal({ item, onClose, onSave }) {
  function handleSubmit(formData) {
    onSave({
      ...item,
      ...formData,
    });
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
      </section>
    </div>
  );
}

export default EditItemModal;