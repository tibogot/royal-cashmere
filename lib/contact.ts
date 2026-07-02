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

export function validateContactForm(fields: ContactFormFields): string | null {
  if (fields.company) {
    return "Une erreur est survenue. Veuillez réessayer.";
  }

  if (fields.name.length < 2) {
    return "Veuillez indiquer votre nom.";
  }

  if (!EMAIL_PATTERN.test(fields.email)) {
    return "Veuillez indiquer une adresse e-mail valide.";
  }

  if (fields.message.length < 10) {
    return "Votre message doit contenir au moins 10 caractères.";
  }

  return null;
}
