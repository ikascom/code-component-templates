import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  getAccountInfoForm,
  initAccountInfoForm,
  setAccountInfoFormFirstName,
  setAccountInfoFormLastName,
  setAccountInfoFormPhone,
  submitAccountInfoForm,
} from "@ikas/bp-storefront";
import FormItem from "../../sub-components/FormItem";
import Input from "../../sub-components/Input";
import Button from "../../sub-components/Button";
import SkeletonField from "../../sub-components/SkeletonField";
import { Props } from "./types";

export function AccountInfoContent({
  title = "My Account",
  successMessage = "Your information has been updated.",
  submitButtonText = "Save",
  submittingButtonText = "Saving...",
  emailLabel = "Email",
}: Props) {
  const accountForm = getAccountInfoForm(customerStore);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initAccountInfoForm(accountForm).finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    await submitAccountInfoForm(accountForm);
  };

  function renderFormField(
    field: typeof accountForm.firstName,
    id: string,
    setter: (form: typeof accountForm, value: string) => void,
    inputProps?: Record<string, unknown>,
  ) {
    if (!field) return null;
    const status = field.hasError ? "error" : "default";
    return (
      <FormItem
        label={field.label}
        htmlFor={id}
        status={status}
        helper={field.hasError ? field.message : undefined}
      >
        <Input
          id={id}
          value={field.value ?? ""}
          onInput={(e: Event) =>
            setter(accountForm, (e.target as HTMLInputElement).value)
          }
          {...inputProps}
        />
      </FormItem>
    );
  }

  return (
    <div className="kombos-account-info-content">
      <h1 className="kombos-account-info-content__title text-md-medium">{title}</h1>

      {accountForm.isSuccess && (
        <div className="kombos-account-info-content__alert kombos-account-info-content__alert--success text-sm-regular">
          {successMessage}
        </div>
      )}
      {accountForm.isFailure && accountForm.responseMessage && (
        <div className="kombos-account-info-content__alert kombos-account-info-content__alert--error text-sm-regular">
          {accountForm.responseMessage}
        </div>
      )}

      {isLoading ? (
        <div className="kombos-account-info-content__form">
          <div className="kombos-account-info-content__row">
            <SkeletonField />
            <SkeletonField />
          </div>
          <div className="kombos-account-info-content__row">
            <SkeletonField />
            <SkeletonField />
          </div>
        </div>
      ) : (
        <form className="kombos-account-info-content__form" onSubmit={handleSubmit}>
          <div className="kombos-account-info-content__row">
            {renderFormField(
              accountForm.firstName,
              "account-first-name",
              setAccountInfoFormFirstName,
            )}
            {renderFormField(
              accountForm.lastName,
              "account-last-name",
              setAccountInfoFormLastName,
            )}
          </div>

          <div className="kombos-account-info-content__row">
            <FormItem label={emailLabel} htmlFor="account-email">
              <Input
                id="account-email"
                value={customerStore.customer?.email ?? ""}
                disabled
              />
            </FormItem>

            {renderFormField(
              accountForm.phone,
              "account-phone",
              setAccountInfoFormPhone,
              { type: "tel" },
            )}
          </div>

          <Button
            variant="primary"
            loading={accountForm.isSubmitting}
            className="kombos-account-info-content__submit"
          >
            {accountForm.isSubmitting ? submittingButtonText : submitButtonText}
          </Button>
        </form>
      )}
    </div>
  );
}

export default AccountInfoContent;
