import { authenticate } from "app/shopify.server";

export async function fetchCustomerTotal(request: Request, customerId: string) {
  try {
    const { admin } = await authenticate.admin(request);

    const formattedCustomerId = `gid://shopify/Customer/${customerId}`;

    const response = await admin.graphql(
      `#graphql
       query GetCustomerOrders($customerId: ID!) {
         customer(id: $customerId) {
           orders(first: 10) {
            edges {
              node {
                id
                currentSubtotalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
              }
            }
           }
         }
       }`,
      { variables: { customerId: formattedCustomerId } },
    );

    const data = (await response.json()) as { data?: any; errors?: any[] };
    let grandTotal = 0;

    if (data.errors) {
      console.error("GraphQL Errors:", data.errors);
      data.errors.forEach((error: any) => {
        console.error("GraphQL Error Details:", error);
      });
      return null;
    }
    if (data.errors) {
      console.error("GraphQL Errors:", data.errors);
      return null;
    }

    if (!response.ok) {
      console.error("Network Error:", response.statusText);
      return null;
    }

    const orders = data.data.customer.orders;
    if (!orders) {
      console.error("No orders found for customer");
      return null;
    }
    for (const edge of orders.edges) {
      const amountString = edge.node.currentSubtotalPriceSet.shopMoney.amount;
      if (amountString) {
        grandTotal += parseFloat(amountString);
      }
    }

    return grandTotal;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
