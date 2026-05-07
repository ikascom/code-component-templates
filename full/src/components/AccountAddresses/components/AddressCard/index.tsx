import {
  IkasCustomerAddress,
  getCustomerAddressText,
} from "@ikas/bp-storefront";
import { getFullName } from "../../../../utils/fullName";

interface Props {
  address: IkasCustomerAddress;
  editButtonText: string;
  deleteButtonText: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AddressCard({
  address,
  editButtonText,
  deleteButtonText,
  onEdit,
  onDelete,
}: Props) {
  const fullName = getFullName(address?.firstName, address?.lastName);

  return (
    <div className="kombos-address-card">
      <div className="kombos-address-card__header">
        <span className="kombos-address-card__title text-sm-medium">
          {address.title}
        </span>
        <div className="kombos-address-card__actions">
          <button
            type="button"
            className="kombos-address-card__edit text-sm-semibold"
            onClick={onEdit}
          >
            {editButtonText}
          </button>
          <button
            type="button"
            className="kombos-address-card__delete text-sm-semibold"
            onClick={onDelete}
          >
            {deleteButtonText}
          </button>
        </div>
      </div>
      <div className="kombos-address-card__body">
        <span className="text-sm-medium">{fullName}</span>
        <span className="text-sm-regular">
          {getCustomerAddressText(address)}
        </span>
      </div>
    </div>
  );
}
