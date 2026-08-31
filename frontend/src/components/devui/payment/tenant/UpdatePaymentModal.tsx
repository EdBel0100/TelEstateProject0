import Modal from "react-modal";
import { useState } from "react";

interface UpdatePaymentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  currentAmount: number;
  onSubmit: (amount: number) => void;
}

export const UpdatePaymentModal: React.FC<UpdatePaymentModalProps> = ({
  isOpen,
  onRequestClose,
  currentAmount,
  onSubmit,
}) => {
  const [amount, setAmount] = useState<number>(currentAmount);

  const handleSubmit = () => {
    onSubmit(amount);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Update Payment"
      className="bg-white p-6 rounded shadow-xl max-w-md mx-auto mt-32"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start"
    >
      <h2 className="text-xl font-bold mb-4">Update Payment</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        className="w-full border px-3 py-2 rounded mb-4"
      />
      <div className="flex justify-end gap-2">
        <button onClick={onRequestClose} className="px-4 py-2 text-sm">Cancel</button>
        <button onClick={handleSubmit} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Save
        </button>
      </div>
    </Modal>
  );
};
