"use client";

import { submitContactForm } from "@/app/actions/contact";
import { initialContactFormState } from "@/lib/contact";
import { ctaLinkClassName } from "@/lib/ui";
import { useActionState } from "react";

const fieldClassName =
  "w-full border-0 border-b border-black/15 bg-transparent py-2 font-sans text-sm uppercase text-black outline-none placeholder:text-black/50 placeholder:uppercase focus:border-black/40";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialContactFormState,
  );

  if (state.success) {
    return (
      <div className="text-left">
        <p className="font-sans text-sm leading-relaxed text-black md:text-base">
          Merci pour votre message. Notre équipe vous répondra dans les plus
          brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 text-left">
      <div>
        <label htmlFor="contact-email" className="sr-only">
          E-mail
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="E-mail *"
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="contact-name" className="sr-only">
          Nom
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Nom *"
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="sr-only">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={3}
          placeholder="Message *"
          className={`${fieldClassName} resize-y`}
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Entreprise</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.error ? (
        <p className="font-sans text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className={`${ctaLinkClassName} mt-2 font-sans transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        {isPending ? "Envoi en cours…" : "Envoyer"}
      </button>
    </form>
  );
}
