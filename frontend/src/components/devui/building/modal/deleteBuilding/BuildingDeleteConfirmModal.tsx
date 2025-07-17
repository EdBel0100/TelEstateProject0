import Modal from "react-modal";

export const BuildingDeleteConfirmModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  buildingName,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  buildingName: string;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Building"
      className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-md mx-auto outline-none shadow-lg"
      overlayClassName="fixed inset-0 bg-black/30 z-50 flex justify-center items-center"
    >
      <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
        Are you sure you want to delete <strong>{buildingName}</strong>? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm"
          onClick={onRequestClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
          onClick={() => {
            onConfirm();
            onRequestClose();
          }}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};
