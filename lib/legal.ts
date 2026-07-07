import { siteConfig } from "@/lib/site";

export const legalLastUpdated = "7 juillet 2026";

export function formatEnterpriseNumber(number: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.length !== 10) return number;
  return `${digits.slice(0, 4)}.${digits.slice(4, 7)}.${digits.slice(7)}`;
}

export function getCompanyAddress() {
  const { street, postalCode, city, country } = siteConfig.contact;
  return `${street}, ${postalCode} ${city}, ${country}`;
}

export function getRegisteredOfficeAddress() {
  return getCompanyAddress();
}

export function getLegalIdentifiers() {
  const { enterpriseNumber, vatNumber, legalForm } = siteConfig.legal;

  return {
    enterpriseNumber: enterpriseNumber.trim() || null,
    vatNumber: vatNumber.trim() || null,
    legalForm: legalForm.trim() || null,
  };
}
