"use client";

import { submitContactForm } from "@/app/actions/contact";
import { initialContactFormState } from "@/lib/contact";
import { useActionState } from "react";

const fieldClassName =
  "w-full border-b border-black/20 bg-transparent py-3 font-serif text-sm text-black outline-none placeholder:text-black/40 focus:border-black/50 md:text-base";

const labelClassName = "text-xs uppercase tracking-wide text-black/50";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialContactFormState,
  );

  if (state.success) {
    return (
      <div className="text-left">
        <p className="font-serif text-base leading-relaxed text-black md:text-lg">
          Merci pour votre message. Notre équipe vous répondra dans les plus
          brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8 text-left">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClassName}>
            Nom
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={`${fieldClassName} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClassName}>
            E-mail
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`${fieldClassName} mt-2`}
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={labelClassName}>
            Téléphone <span className="normal-case">(optionnel)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={`${fieldClassName} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className={labelClassName}>
            Sujet <span className="normal-case">(optionnel)</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            className={`${fieldClassName} mt-2`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClassName}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          className={`${fieldClassName} mt-2 resize-y`}
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
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center border border-black px-8 py-3 text-sm uppercase tracking-wide transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}
