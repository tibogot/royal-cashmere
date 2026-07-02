"use server";

import {
  type ContactFormState,
  isContactEmailConfigured,
  parseContactFormData,
  validateContactForm,
} from "@/lib/contact";
import { siteConfig } from "@/lib/site";

async function sendContactEmail(fields: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ??
    `${siteConfig.name} <onboarding@resend.dev>`;

  if (!apiKey || !toEmail) {
    throw new Error("Contact email is not configured.");
  }

  const subjectLine =
    fields.subject.trim().length > 0
      ? `[Contact] ${fields.subject}`
      : `[Contact] Message de ${fields.name}`;

  const text = [
    `Nom : ${fields.name}`,
    `E-mail : ${fields.email}`,
    fields.phone ? `Téléphone : ${fields.phone}` : null,
    fields.subject ? `Sujet : ${fields.subject}` : null,
    "",
    fields.message,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: fields.email,
      subject: subjectLine,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send contact email.");
  }
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (!isContactEmailConfigured()) {
    return {
      ok: false,
      error:
        "Le formulaire de contact n'est pas encore configuré. Contactez-nous par téléphone en attendant.",
      success: false,
    };
  }

  const fields = parseContactFormData(formData);
  const validationError = validateContactForm(fields);

  if (validationError) {
    return {
      ok: false,
      error: validationError,
      success: false,
    };
  }

  try {
    await sendContactEmail(fields);

    return {
      ok: true,
      error: null,
      success: true,
    };
  } catch {
    return {
      ok: false,
      error:
        "L'envoi du message a échoué. Veuillez réessayer ou nous appeler directement.",
      success: false,
    };
  }
}
