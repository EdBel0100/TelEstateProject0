import Modal from "react-modal";
import { useState } from "react";

interface CreatePaymentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (amount: number) => void;
}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
}) => {
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = () => {
    onSubmit(amount);
    setAmount(0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create Payment"
      className="bg-white p-6 rounded shadow-xl max-w-md mx-auto mt-32"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start"
    >
      <h2 className="text-xl font-bold mb-4">Create Payment</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        className="w-full border px-3 py-2 rounded mb-4"
        placeholder="Enter amount"
      />
      <div className="flex justify-end gap-2">
        <button onClick={onRequestClose} className="px-4 py-2 text-sm">Cancel</button>
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </div>
    </Modal>
  );
};
