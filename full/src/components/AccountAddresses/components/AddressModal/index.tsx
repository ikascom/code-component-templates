import { Fragment } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import {
  type AddressForm,
  type IkasFormItem,
  type IkasFormItemOption,
  type IkasFormFreeText,
  type AddressFormItem,
  IkasCustomerAddress,
  getIkasCustomerAddressForm,
  getEmptyAddressForm,
  initAddressForm,
  submitAddressForm,
  setAddressFormFirstName,
  setAddressFormLastName,
  setAddressFormIdentityNumber,
  setAddressFormPhone,
  setAddressFormAddressLine1,
  setAddressFormAddressLine2,
  setAddressFormCountry,
  setAddressFormState,
  setAddressFormCity,
  setAddressFormDistrict,
  setAddressFormRegion,
  setAddressFormPostalCode,
  setAddressFormTitle,
  customerStore,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Modal from "../../../../sub-components/Modal";
import FormItem from "../../../../sub-components/FormItem";
import Input from "../../../../sub-components/Input";
import Select from "../../../../sub-components/Select";
import SkeletonField from "../../../../sub-components/SkeletonField";

interface Props {
  address?: IkasCustomerAddress;
  title: string;
  saveButtonText: string;
  savingButtonText: string;
  cancelButtonText: string;
  onClose: () => void;
  onSaved: () => void;
}

type FormFieldSetter = (form: AddressForm, value: string) => void;

const SKELETON_ROWS: AddressFormItem[][] = [
  ["firstName", "lastName"],
  ["identityNumber"],
  ["phone"],
  ["addressLine1"],
  ["addressLine2"],
  ["country"],
  ["state", "city"],
  ["district", "postalCode"],
];

const getFieldStatus = (field?: { hasError: boolean }): "default" | "error" =>
  field?.hasError ? "error" : "default";

const getFieldHelper = (field?: { hasError: boolean; message?: string }) =>
  field?.hasError ? field.message : undefined;

const AddressModal = observer(function AddressModal({
  address,
  title,
  saveButtonText,
  savingButtonText,
  cancelButtonText,
  onClose,
  onSaved,
}: Props) {
  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;

  const [addressForm] = useState<AddressForm>(() =>
    address
      ? getIkasCustomerAddressForm(address)
      : getEmptyAddressForm(customerStore),
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initAddressForm(addressForm, address).then(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const success = await submitAddressForm(addressForm);
    if (success) {
      onSavedRef.current();
      onClose();
    }
  };

  const renderInput = (
    field: IkasFormItem | undefined,
    setter: FormFieldSetter,
    id: string,
    type?: string,
  ) => {
    if (!field) return null;

    return (
      <FormItem
        label={field.label ?? ""}
        htmlFor={id}
        status={getFieldStatus(field)}
        helper={getFieldHelper(field)}
      >
        <Input
          id={id}
          type={type}
          value={field.value ?? ""}
          placeholder={field.placeholder}
          onInput={(e: Event) =>
            setter(addressForm, (e.target as HTMLInputElement).value)
          }
        />
      </FormItem>
    );
  };

  const renderSelect = (
    field: IkasFormFreeText | undefined,
    options: IkasFormItemOption[] | undefined,
    setter: FormFieldSetter,
    id: string,
  ) => {
    if (!field) return null;

    if (field.isFreeText || !options?.length) {
      return renderInput(field, setter, id);
    }

    return (
      <FormItem
        label={field.label ?? ""}
        htmlFor={id}
        status={getFieldStatus(field)}
        helper={getFieldHelper(field)}
      >
        <Select
          id={id}
          options={[{ value: "", label: field.placeholder ?? "" }, ...options]}
          value={field.value ?? ""}
          onChange={(e: Event) =>
            setter(addressForm, (e.target as HTMLSelectElement).value)
          }
          disabled={field.isLoading}
        />
      </FormItem>
    );
  };

  const renderFormField = (key: AddressFormItem) => {
    switch (key) {
      case "firstName":
        return renderInput(
          addressForm.firstName,
          setAddressFormFirstName,
          "addr-first-name",
        );
      case "lastName":
        return renderInput(
          addressForm.lastName,
          setAddressFormLastName,
          "addr-last-name",
        );
      case "identityNumber":
        return renderInput(
          addressForm.identityNumber,
          setAddressFormIdentityNumber,
          "addr-identity",
        );
      case "phone":
        return renderInput(
          addressForm.phone,
          setAddressFormPhone,
          "addr-phone",
          "tel",
        );
      case "addressLine1":
        return renderInput(
          addressForm.addressLine1,
          setAddressFormAddressLine1,
          "addr-line1",
        );
      case "addressLine2":
        return renderInput(
          addressForm.addressLine2,
          setAddressFormAddressLine2,
          "addr-line2",
        );
      case "country":
        return renderSelect(
          addressForm.country,
          addressForm.countryOptions,
          setAddressFormCountry,
          "addr-country",
        );
      case "state":
        return renderSelect(
          addressForm.state,
          addressForm.stateOptions,
          setAddressFormState,
          "addr-state",
        );
      case "city":
        return renderSelect(
          addressForm.city,
          addressForm.cityOptions,
          setAddressFormCity,
          "addr-city",
        );
      case "district":
        return renderSelect(
          addressForm.district,
          addressForm.districtOptions,
          setAddressFormDistrict,
          "addr-district",
        );
      case "region":
        return addressForm.regionOptions?.length
          ? renderSelect(
              addressForm.region,
              addressForm.regionOptions,
              setAddressFormRegion,
              "addr-region",
            )
          : null;
      case "postalCode":
        return renderInput(
          addressForm.postalCode,
          setAddressFormPostalCode,
          "addr-postal",
        );
      default:
        return null;
    }
  };

  const renderRowLayout = (
    rows: AddressFormItem[][],
    renderItem: (key: AddressFormItem) => preact.JSX.Element | null,
  ) =>
    rows.map((row) => {
      const visibleKeys = row.filter((key) => addressForm[key] != null);
      if (visibleKeys.length === 0) return null;
      const rowKey = visibleKeys.join("-");
      if (visibleKeys.length === 1) {
        return <Fragment key={rowKey}>{renderItem(visibleKeys[0])}</Fragment>;
      }
      return (
        <div key={rowKey} className="kombos-address-modal__row">
          {visibleKeys.map((key) => (
            <Fragment key={key}>{renderItem(key)}</Fragment>
          ))}
        </div>
      );
    });

  return (
    <Modal
      onClose={onClose}
      title={title}
      cancelText={cancelButtonText}
      okText={addressForm.isSubmitting ? savingButtonText : saveButtonText}
      okButtonProps={{
        type: "submit",
        form: "kombos-address-form",
        disabled: addressForm.isSubmitting || isLoading,
      }}
    >
      {isLoading ? (
        <div className="kombos-address-modal__form">
          <SkeletonField labelWidth="40%" />
          {renderRowLayout(SKELETON_ROWS, () => (
            <SkeletonField labelWidth="40%" />
          ))}
        </div>
      ) : (
        <form
          id="kombos-address-form"
          className="kombos-address-modal__form"
          onSubmit={handleSubmit}
        >
          {renderInput(addressForm.title, setAddressFormTitle, "addr-title")}
          {renderRowLayout(addressForm.addressFormat ?? [], renderFormField)}
        </form>
      )}
    </Modal>
  );
});

export default AddressModal;
