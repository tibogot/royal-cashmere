"use client";

import { submitContactForm } from "@/app/actions/contact";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { initialContactFormState } from "@/lib/contact";
import { ctaLinkClassName } from "@/lib/ui";
import { useActionState } from "react";

const fieldClassName =
  "w-full border-0 border-b border-black/15 bg-transparent py-2 font-sans text-sm uppercase text-black outline-none placeholder:text-black/50 placeholder:uppercase focus:border-black/40";

export default function ContactForm() {
  const copy = useDictionary().contactForm;
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialContactFormState,
  );

  if (state.success) {
    return (
      <div className="text-left">
        <p className="font-sans text-sm leading-relaxed text-black md:text-base">
          {copy.success}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 text-left">
      {/* Tells the action which language to answer in. */}
      <input type="hidden" name="locale" value={locale} />

      <div>
        <label htmlFor="contact-email" className="sr-only">
          {copy.emailLabel}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={copy.emailPlaceholder}
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="contact-name" className="sr-only">
          {copy.nameLabel}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder={copy.namePlaceholder}
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="sr-only">
          {copy.messageLabel}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={3}
          placeholder={copy.messagePlaceholder}
          className={`${fieldClassName} resize-y`}
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">{copy.companyLabel}</label>
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
        {isPending ? copy.sending : copy.submit}
      </button>
    </form>
  );
}
