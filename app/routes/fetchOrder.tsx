import { authenticate } from "app/shopify.server";

export async function fetchOrder(request: Request, orderId: string) {
  try {
    const { admin } = await authenticate.admin(request);

    const formattedOrderId = `gid://shopify/Order/${orderId}`;

    const response = await admin.graphql(
      `#graphql
       query GetOrderSubtotal($orderId: ID!) {
         order(id: $orderId) {
           currentSubtotalPriceSet {
             shopMoney {
               amount
               currencyCode
             }
           }
         }
       }`,
      { variables: { orderId: formattedOrderId } },
    );

    const data = (await response.json()) as { data?: any; errors?: any[] };

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

    const amountString =
      data.data.order.currentSubtotalPriceSet.shopMoney.amount;

    if (amountString) {
      const subtotal = parseFloat(amountString);
      return subtotal;
    } else {
      console.error("Subtotal amount not found in the response");
      return null;
    }
  } catch (error) {
    console.error("Error fetching order subtotal:", error);
    return null;
  }
}
