import type { CustomerProfile } from "./customer";

type DisplayNameCustomer = Pick<
  CustomerProfile,
  "displayName" | "firstName" | "lastName" | "emailAddress"
>;

export function getCustomerDisplayName(
  customer: DisplayNameCustomer | null | undefined,
) {
  if (!customer) return null;

  const fullName = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (customer.displayName) return customer.displayName;
  if (fullName) return fullName;
  return customer.emailAddress?.emailAddress ?? null;
}
