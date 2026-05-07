import { useState } from "preact/hooks";
import {
  customerStore,
  IkasCustomerAddress,
  deleteCustomerAddress,
} from "@ikas/bp-storefront";
import Button from "../../sub-components/Button";
import AddressCard from "./components/AddressCard";
import AddressModal from "./components/AddressModal";
import ConfirmModal from "../../sub-components/ConfirmModal";
import { Props } from "./types";

export function AccountAddresses({
  title = "My Addresses",
  addButtonText = "Add Address",
  emptyMessage = "No addresses added yet.",
  editButtonText = "Edit",
  deleteButtonText = "Delete",
  saveButtonText = "Save",
  savingButtonText = "Saving...",
  cancelButtonText = "Cancel",
  modalTitleAdd = "Add Address",
  modalTitleEdit = "Edit Address",
  deleteConfirmMessage = "Are you sure you want to delete this address?",
  deleteConfirmTitle = "Delete Address",
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    IkasCustomerAddress | undefined
  >(undefined);
  const [deletingAddress, setDeletingAddress] = useState<
    IkasCustomerAddress | undefined
  >(undefined);

  const addresses = customerStore.customer?.addresses ?? [];

  const handleAdd = () => {
    setEditingAddress(undefined);
    setModalOpen(true);
  };

  const handleEdit = (addr: IkasCustomerAddress) => {
    setEditingAddress(addr);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAddress) return;
    await deleteCustomerAddress(customerStore, deletingAddress);
    setDeletingAddress(undefined);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingAddress(undefined);
  };

  return (
    <div className="kombos-account-addresses">
      <h1 className="kombos-account-addresses__title text-md-medium">{title}</h1>

      {addresses.length === 0 ? (
        <div className="kombos-account-addresses__empty-state">
          <p className="kombos-account-addresses__empty text-sm-medium">{emptyMessage}</p>
          <Button
            variant="primary"
            size="s"
            onClick={handleAdd}
            className="kombos-account-addresses__add"
          >
            {addButtonText}
          </Button>
        </div>
      ) : (
        <>
          <div className="kombos-account-addresses__grid">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                editButtonText={editButtonText}
                deleteButtonText={deleteButtonText}
                onEdit={() => handleEdit(addr)}
                onDelete={() => setDeletingAddress(addr)}
              />
            ))}
          </div>

          <Button
            variant="primary"
            size="s"
            onClick={handleAdd}
            className="kombos-account-addresses__add"
          >
            {addButtonText}
          </Button>
        </>
      )}

      {modalOpen && (
        <AddressModal
          address={editingAddress}
          title={editingAddress ? modalTitleEdit : modalTitleAdd}
          saveButtonText={saveButtonText}
          savingButtonText={savingButtonText}
          cancelButtonText={cancelButtonText}
          onClose={handleModalClose}
          onSaved={handleModalClose}
        />
      )}

      {deletingAddress && (
        <ConfirmModal
          title={deleteConfirmTitle}
          message={deleteConfirmMessage}
          cancelText={cancelButtonText}
          confirmText={deleteButtonText}
          confirmVariant="dangerous"
          onClose={() => setDeletingAddress(undefined)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default AccountAddresses;
