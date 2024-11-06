import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { fetchOrder } from "./ordersQuery";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  console.log(JSON.stringify(request, null, 2));
  await authenticate.admin(request);
  const { orderId } = params;

  if (!orderId) {
    throw new Response("Order ID is required", { status: 400 });
  }

  const subtotal = await fetchOrder(request, orderId);

  if (subtotal === null) {
    throw new Response("Order not found", { status: 404 });
  }

  return json(
    { subtotal },
    {
      headers: {
        // Allow requests from all origins (or specify your client origin)
        "Access-Control-Allow-Origin": "*",
        // Allow specific headers if necessary
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    },
  );
};

export default null;
