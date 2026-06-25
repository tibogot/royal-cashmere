import { customerAccountQuery } from "./auth";
import {
  CUSTOMER_ACCOUNT_QUERY,
  CUSTOMER_ORDERS_QUERY,
} from "./queries";

export type CustomerProfile = {
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  emailAddress: {
    emailAddress: string;
  } | null;
};

export type CustomerOrder = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
};

type CustomerAccountData = {
  customer: CustomerProfile | null;
};

type CustomerOrdersData = {
  customer: {
    orders: {
      nodes: CustomerOrder[];
    };
  } | null;
};

export async function getCustomerProfile() {
  const result = await customerAccountQuery<CustomerAccountData>(
    CUSTOMER_ACCOUNT_QUERY,
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true as const,
    customer: result.data.customer,
  };
}

export async function getCustomerOrders() {
  const result = await customerAccountQuery<CustomerOrdersData>(
    CUSTOMER_ORDERS_QUERY,
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true as const,
    orders: result.data.customer?.orders.nodes ?? [],
  };
}

export async function getCustomerAccountSummary() {
  const [profileResult, ordersResult] = await Promise.all([
    getCustomerProfile(),
    getCustomerOrders(),
  ]);

  if (!profileResult.ok) {
    return profileResult;
  }

  return {
    ok: true as const,
    customer: profileResult.customer,
    orders: ordersResult.ok ? ordersResult.orders : [],
  };
}
