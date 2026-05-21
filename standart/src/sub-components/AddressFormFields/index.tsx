import { observer } from "@ikas/component-utils";
import {
  AddressForm,
  setAddressFormFirstName,
  setAddressFormLastName,
  setAddressFormIdentityNumber,
  setAddressFormAddressLine1,
  setAddressFormAddressLine2,
  setAddressFormPostalCode,
  setAddressFormCountry,
  setAddressFormState,
  setAddressFormCity,
  setAddressFormDistrict,
  setAddressFormRegion,
  setAddressFormPhone,
  setAddressFormCompany,
  setAddressFormTaxOffice,
  setAddressFormTaxNumber,
} from "@ikas/bp-storefront";

interface Props {
  form: AddressForm;
  disabled?: boolean;
  // Bumped by the parent after every setter call so this component re-reads
  // form.addressFormat — which ikas adds *after* makeAutoObservable runs and
  // so isn't tracked by MobX on its own.
  revision: number;
  onChange: () => void;
}

type FieldKey =
  | "firstName"
  | "lastName"
  | "identityNumber"
  | "addressLine1"
  | "addressLine2"
  | "postalCode"
  | "country"
  | "state"
  | "city"
  | "district"
  | "region"
  | "phone"
  | "company"
  | "taxOffice"
  | "taxNumber";

type Setter = (form: AddressForm, value: string) => void;

const TEXT_SETTERS: Partial<Record<FieldKey, Setter>> = {
  firstName: setAddressFormFirstName,
  lastName: setAddressFormLastName,
  identityNumber: setAddressFormIdentityNumber,
  addressLine1: setAddressFormAddressLine1,
  addressLine2: setAddressFormAddressLine2,
  postalCode: setAddressFormPostalCode,
  phone: setAddressFormPhone,
  company: setAddressFormCompany,
  taxOffice: setAddressFormTaxOffice,
  taxNumber: setAddressFormTaxNumber,
};

const SELECT_SETTERS: Partial<Record<FieldKey, Setter>> = {
  country: setAddressFormCountry,
  state: setAddressFormState,
  city: setAddressFormCity,
  district: setAddressFormDistrict,
  region: setAddressFormRegion,
};

const SELECT_OPTIONS_KEY: Partial<Record<FieldKey, keyof AddressForm>> = {
  country: "countryOptions",
  state: "stateOptions",
  city: "cityOptions",
  district: "districtOptions",
  region: "regionOptions",
};

const FIELD_AUTOCOMPLETE: Partial<Record<FieldKey, string>> = {
  firstName: "given-name",
  lastName: "family-name",
  addressLine1: "address-line1",
  addressLine2: "address-line2",
  postalCode: "postal-code",
  phone: "tel",
  country: "country-name",
  state: "address-level1",
  city: "address-level2",
  district: "address-level3",
};

const FREE_TEXT_CAPABLE: ReadonlySet<FieldKey> = new Set<FieldKey>([
  "city",
  "district",
]);

interface FormFieldShape {
  value?: string;
  label?: string;
  placeholder?: string;
  hasError?: boolean;
  message?: string;
  isRequired?: boolean;
  isLoading?: boolean;
  isFreeText?: boolean;
}

interface OptionShape {
  value: string;
  label: string;
}

const AddressFormFields = observer(function AddressFormFields({
  form,
  disabled,
  revision,
  onChange,
}: Props) {
  // Read `revision` so the observer re-runs when the parent bumps it.
  void revision;

  const layout = form.addressFormat ?? [];
  if (!layout.length) return null;

  const renderedRows = layout
    .map((row, rowIdx) => {
      const cells = row
        .map((rawName) =>
          renderField(form, rawName as FieldKey, !!disabled, onChange),
        )
        .filter((cell): cell is preact.JSX.Element => cell !== null);
      if (cells.length === 0) return null;
      return (
        <div
          key={rowIdx}
          class="address-form-fields__row"
          style={{
            gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))`,
          }}
        >
          {cells}
        </div>
      );
    })
    .filter((row): row is preact.JSX.Element => row !== null);

  if (renderedRows.length === 0) return null;

  return <div class="address-form-fields">{renderedRows}</div>;
});

export default AddressFormFields;

function renderField(
  form: AddressForm,
  fieldName: FieldKey,
  disabled: boolean,
  onChange: () => void,
): preact.JSX.Element | null {
  const field = (form as Record<string, unknown>)[fieldName] as
    | FormFieldShape
    | undefined;
  if (!field) return null;

  const inputId = `addr-${fieldName}`;
  const labelText = field.label ?? "";
  const required = field.isRequired === true;
  const baseLabel = (
    <label class="address-form-fields__label" htmlFor={inputId}>
      {labelText}
      {required ? " *" : ""}
    </label>
  );

  const textSetter = TEXT_SETTERS[fieldName];
  const selectSetter = SELECT_SETTERS[fieldName];

  // Free-text city/district falls back to a text input.
  const useTextInput =
    !!textSetter ||
    (FREE_TEXT_CAPABLE.has(fieldName) && field.isFreeText === true);

  if (useTextInput) {
    const setter =
      textSetter ?? (FREE_TEXT_CAPABLE.has(fieldName) ? selectSetter : undefined);
    if (!setter) return null;

    return (
      <div key={fieldName} class="address-form-fields__field">
        {baseLabel}
        <input
          id={inputId}
          class="address-form-fields__input"
          type={fieldName === "phone" ? "tel" : "text"}
          autocomplete={FIELD_AUTOCOMPLETE[fieldName]}
          value={field.value ?? ""}
          placeholder={field.placeholder || ""}
          onInput={(e) => {
            setter(form, (e.currentTarget as HTMLInputElement).value);
            onChange();
          }}
          disabled={disabled}
          required={required}
          aria-invalid={field.hasError ? "true" : undefined}
        />
        {field.hasError && field.message ? (
          <span class="address-form-fields__error-text">{field.message}</span>
        ) : null}
      </div>
    );
  }

  // Otherwise it's a select.
  if (!selectSetter) return null;
  const optionsKey = SELECT_OPTIONS_KEY[fieldName];
  const options = optionsKey
    ? (((form as Record<string, unknown>)[optionsKey] as OptionShape[]) ?? [])
    : [];
  const isLoading = field.isLoading === true;
  const hasOptions = options.length > 0;

  // Skip-empty-select rule: hide the dropdown entirely when there are no
  // options, nothing is loading, and the field isn't required. This kills
  // e.g. the empty TR "Bölge" dropdown without breaking countries that
  // genuinely populate the same slot.
  if (!hasOptions && !isLoading && !required) return null;

  return (
    <div key={fieldName} class="address-form-fields__field">
      {baseLabel}
      <select
        id={inputId}
        class="address-form-fields__input"
        value={field.value ?? ""}
        onChange={(e) => {
          selectSetter(form, (e.currentTarget as HTMLSelectElement).value);
          onChange();
        }}
        disabled={disabled || isLoading || (!hasOptions && !isLoading)}
        required={required}
        aria-invalid={field.hasError ? "true" : undefined}
      >
        <option value="">{field.placeholder || "—"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {field.hasError && field.message ? (
        <span class="address-form-fields__error-text">{field.message}</span>
      ) : null}
    </div>
  );
}
