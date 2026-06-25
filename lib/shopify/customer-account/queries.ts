export const CUSTOMER_ACCOUNT_QUERY = `
  query CustomerAccount {
    customer {
      firstName
      lastName
      displayName
      emailAddress {
        emailAddress
      }
    }
  }
`;

export const CUSTOMER_ORDERS_QUERY = `
  query CustomerOrders {
    customer {
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
