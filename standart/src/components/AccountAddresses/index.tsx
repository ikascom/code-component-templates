import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  waitForCustomerStoreInit,
  deleteCustomerAddress,
  getEmptyAddressForm,
  getIkasCustomerAddressForm,
  initAddressForm,
  submitAddressForm,
  setAddressFormTitle,
  IkasCustomerAddress,
  AddressForm,
} from "@ikas/bp-storefront";
import AccountSidebar from "../../sub-components/AccountSidebar";
import AddressFormFields from "../../sub-components/AddressFormFields";
import { Props } from "./types";

type FormMode = "add" | "edit" | null;

export function AccountAddresses({
  backgroundColor = "#FAF8F5",
  pageTitle = "Adreslerim",
  addButtonText = "Yeni Adres Ekle",
  emptyStateText = "Kayıtlı adresiniz bulunmuyor",
  emptyStateSubtext = "Siparişlerinizi daha hızlı tamamlamak için adres ekleyin",
  editButtonText = "Düzenle",
  deleteButtonText = "Sil",
  confirmDeleteText = "Bu adresi silmek istediğinizden emin misiniz?",
  formTitleAdd = "Yeni Adres",
  formTitleEdit = "Adresi Düzenle",
  addressTitleLabel = "Adres Başlığı",
  addressTitlePlaceholder = "Ev, İş...",
  saveButtonText = "Kaydet",
  savingButtonText = "Kaydediliyor...",
  cancelButtonText = "İptal",
  sidebarNavAriaLabel = "Hesap navigasyonu",
}: Props) {
  // If the customer is already hydrated when we mount (e.g. SPA navigation
  // from AccountDashboard), skip the null/loading frame entirely — otherwise
  // the main column flashes blank for a tick while waitForCustomerStoreInit
  // resolves its microtask.
  const [isInitialized, setIsInitialized] = useState(
    () => !!customerStore.customer,
  );
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<AddressForm | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Bumped after every form mutation so AddressFormFields re-reads the
  // non-MobX-tracked `form.addressFormat` (see plan/root-cause notes).
  const [formRevision, setFormRevision] = useState(0);
  const bumpForm = () => setFormRevision((r) => r + 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await waitForCustomerStoreInit(customerStore);
      } finally {
        if (!cancelled) setIsInitialized(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const customer = customerStore.customer;
  const addresses: IkasCustomerAddress[] =
    (customer?.addresses ?? []) as IkasCustomerAddress[];

  const openAddForm = async () => {
    if (!customer) return;
    setErrorMessage(null);
    const form = getEmptyAddressForm(customerStore);
    setFormMode("add");
    setEditingAddressId(null);
    try {
      await initAddressForm(form);
      setActiveForm(form);
      bumpForm();
    } catch {
      setErrorMessage("Form yüklenemedi. Lütfen tekrar deneyin.");
    }
  };

  const openEditForm = async (address: IkasCustomerAddress) => {
    setErrorMessage(null);
    const form = getIkasCustomerAddressForm(address);
    setFormMode("edit");
    setEditingAddressId(address.id);
    try {
      await initAddressForm(form, address);
      setActiveForm(form);
      bumpForm();
    } catch {
      setErrorMessage("Form yüklenemedi. Lütfen tekrar deneyin.");
    }
  };

  const closeForm = () => {
    setFormMode(null);
    setEditingAddressId(null);
    setActiveForm(null);
    setErrorMessage(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (!activeForm || isSubmitting) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const success = await submitAddressForm(activeForm);
      if (success) {
        closeForm();
      } else {
        setErrorMessage(
          activeForm.responseMessage ||
            "Adres kaydedilemedi. Lütfen alanları kontrol edin.",
        );
      }
    } catch {
      setErrorMessage("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (address: IkasCustomerAddress) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(confirmDeleteText);
      if (!confirmed) return;
    }
    try {
      await deleteCustomerAddress(customerStore, address);
      if (editingAddressId === address.id) closeForm();
    } catch {
      // surfaces silently in the address list; could add a toast in future
    }
  };

  const renderForm = () => {
    if (!activeForm || formMode === null) return null;

    const titleField = activeForm.title;
    const headingText = formMode === "add" ? formTitleAdd : formTitleEdit;

    return (
      <form
        class="account-addresses__form"
        onSubmit={handleSubmit}
        noValidate
        aria-label={headingText}
      >
        <h2 class="account-addresses__form-title">{headingText}</h2>

        <div class="account-addresses__field">
          <label class="account-addresses__label" htmlFor="addr-title">
            {addressTitleLabel}
          </label>
          <input
            id="addr-title"
            class="account-addresses__input"
            type="text"
            placeholder={addressTitlePlaceholder}
            value={titleField?.value ?? ""}
            onInput={(e) => {
              setAddressFormTitle(
                activeForm,
                (e.currentTarget as HTMLInputElement).value,
              );
              bumpForm();
            }}
            disabled={isSubmitting}
          />
        </div>

        <AddressFormFields
          form={activeForm}
          disabled={isSubmitting}
          revision={formRevision}
          onChange={bumpForm}
        />

        {errorMessage ? (
          <p class="account-addresses__error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div class="account-addresses__form-actions">
          <button
            type="button"
            class="account-addresses__btn account-addresses__btn--secondary"
            onClick={closeForm}
            disabled={isSubmitting}
          >
            {cancelButtonText}
          </button>
          <button
            type="submit"
            class="account-addresses__btn account-addresses__btn--primary"
            disabled={isSubmitting}
            aria-busy={isSubmitting ? "true" : undefined}
          >
            {isSubmitting ? savingButtonText : saveButtonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <section
      class="account-addresses"
      // Inline `visibility: hidden` prevents the cold-load FOUC; the
      // component's CSS flips it back via !important once the chunk loads.
      // `minHeight: 100vh` reserves space so the footer doesn't jump.
      style={{
        visibility: "hidden",
        minHeight: "100vh",
        ...(backgroundColor ? { backgroundColor } : null),
      }}
    >
      <div class="account-addresses__container">
        <div class="account-addresses__layout">
          <AccountSidebar activeKey="addresses" navAriaLabel={sidebarNavAriaLabel} />

          <div class="account-addresses__main">
            <div class="account-addresses__header">
              <h1 class="account-addresses__title">{pageTitle}</h1>
              <button
                type="button"
                class="account-addresses__btn account-addresses__btn--secondary account-addresses__add-btn"
                onClick={openAddForm}
                disabled={formMode === "add"}
              >
                {addButtonText}
              </button>
            </div>
            <hr class="account-addresses__divider" />

            {!isInitialized ? null : addresses.length === 0 &&
              formMode !== "add" ? (
              <div class="account-addresses__empty">
                <p class="account-addresses__empty-text">{emptyStateText}</p>
                <p class="account-addresses__empty-subtext">
                  {emptyStateSubtext}
                </p>
              </div>
            ) : (
              <ul class="account-addresses__list">
                {formMode === "add" ? (
                  <li class="account-addresses__list-item account-addresses__list-item--form">
                    {renderForm()}
                  </li>
                ) : null}

                {addresses.map((address) => {
                  const isEditing =
                    formMode === "edit" && editingAddressId === address.id;
                  return (
                    <li
                      key={address.id}
                      class={
                        "account-addresses__list-item" +
                        (isEditing
                          ? " account-addresses__list-item--form"
                          : "")
                      }
                    >
                      {isEditing ? (
                        renderForm()
                      ) : (
                        <>
                          <div class="account-addresses__info">
                            {address.title ? (
                              <span class="account-addresses__address-title">
                                {address.title}
                              </span>
                            ) : null}
                            <span class="account-addresses__recipient">
                              {[address.firstName, address.lastName]
                                .filter(Boolean)
                                .join(" ")}
                            </span>
                            <span class="account-addresses__line">
                              {address.addressLine1}
                              {address.addressLine2
                                ? `, ${address.addressLine2}`
                                : ""}
                            </span>
                            <span class="account-addresses__line">
                              {[
                                address.district?.name,
                                address.city?.name,
                                address.state?.name,
                                address.country?.name,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                              {address.postalCode
                                ? ` ${address.postalCode}`
                                : ""}
                            </span>
                            {address.phone ? (
                              <span class="account-addresses__line">
                                {address.phone}
                              </span>
                            ) : null}
                          </div>
                          <div class="account-addresses__actions">
                            <button
                              type="button"
                              class="account-addresses__action-link"
                              onClick={() => openEditForm(address)}
                            >
                              {editButtonText}
                            </button>
                            <span
                              class="account-addresses__action-divider"
                              aria-hidden="true"
                            >
                              |
                            </span>
                            <button
                              type="button"
                              class="account-addresses__action-link"
                              onClick={() => handleDelete(address)}
                            >
                              {deleteButtonText}
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccountAddresses;
