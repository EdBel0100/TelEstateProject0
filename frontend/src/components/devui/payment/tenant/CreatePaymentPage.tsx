"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  useCreateTenantPaymentPlanMutation,
  useUpdateTenantPaymentPlanMutation,
  useGetTenantPaymentPlanQuery,
  useGetPropertyForTenantQuery,
} from "@/state/api";

import { CreatePaymentModal } from "./CreatePaymentModal";
import { UpdatePaymentModal } from "./UpdatePaymentModal";

export const CreatePaymentPage: React.FC = () => {
  const { data: property, isLoading: loadingProperty } = useGetPropertyForTenantQuery();
  const { data: paymentPlan, isLoading: loadingPayment } = useGetTenantPaymentPlanQuery();

  const [createPayment] = useCreateTenantPaymentPlanMutation();
  const [updatePayment] = useUpdateTenantPaymentPlanMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);

  useEffect(() => {
    if (paymentPlan?.setPrice) {
      setPaymentAmount(paymentPlan.setPrice);
    }
  }, [paymentPlan]);

  const handleCreate = async (amount: number) => {
    try {
      await createPayment({ setPrice: amount }).unwrap();
      toast.success("Payment created successfully");
      setPaymentAmount(amount);
      setShowCreateModal(false);
    } catch {
      toast.error("Failed to create payment");
    }
  };

  const handleUpdate = async (amount: number) => {
    try {
      await updatePayment({ setPrice: amount }).unwrap();
      toast.success("Payment updated");
      setPaymentAmount(amount);
      setShowUpdateModal(false);
    } catch {
      toast.error("Failed to update payment");
    }
  };

  if (loadingProperty || loadingPayment) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg">
      <Toaster />

      <h2 className="text-2xl font-bold mb-4">Payments</h2>

      {property && (
        <div className="mb-4 border p-4 rounded bg-gray-50">
          <p><strong>Apartment:</strong> {property.apartmentNumber}</p>
          <p><strong>Building:</strong> {property.building?.name || "N/A"}</p>
          <p><strong>Address:</strong> {property.building?.location?.address || "N/A"}</p>
        </div>
      )}

      <div className="space-y-4">
        {paymentAmount === null ? (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowCreateModal(true)}
          >
            Create Payment
          </button>
        ) : (
          <div className="border rounded p-4 bg-green-50">
            <p className="text-green-700">
              Current Payment: <strong>${paymentAmount}</strong>
            </p>
            <button
              className="mt-2 text-sm text-blue-500 hover:underline"
              onClick={() => setShowUpdateModal(true)}
            >
              Modify Amount
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePaymentModal
        isOpen={showCreateModal}
        onRequestClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />

      {paymentAmount !== null && (
        <UpdatePaymentModal
          isOpen={showUpdateModal}
          onRequestClose={() => setShowUpdateModal(false)}
          currentAmount={paymentAmount}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};
