export type ContactFormState = {
  ok: boolean;
  error: string | null;
  success: boolean;
};

export const initialContactFormState: ContactFormState = {
  ok: false,
  error: null,
  success: false,
};

export type ContactFormFields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  company: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isContactEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
}

export function parseContactFormData(formData: FormData): ContactFormFields {
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
  };
}

/**
 * Which field failed, as a key of the `contact.formErrors` copy; the action
 * turns it into a message in the visitor's language.
 */
export type ContactFormError = "generic" | "name" | "email" | "message";

export function validateContactForm(
  fields: ContactFormFields,
): ContactFormError | null {
  if (fields.company) {
    return "generic";
  }

  if (fields.name.length < 2) {
    return "name";
  }

  if (!EMAIL_PATTERN.test(fields.email)) {
    return "email";
  }

  if (fields.message.length < 10) {
    return "message";
  }

  return null;
}
