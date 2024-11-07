import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { fetchCustomerTotal } from "./fetchCustomer";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  console.log("LOADER", JSON.stringify(request, null, 2));
  await authenticate.admin(request);
  const { customerId } = params;

  if (!customerId) {
    throw new Response("Customer ID is required", { status: 400 });
  }

  const data = await fetchCustomerTotal(request, customerId);

  if (data === null) {
    throw new Response("Order not found", { status: 404 });
  }
  console.log("PATH LOG: ", data);

  const totalPoints = data * 10;

  return json(
    { totalPoints },
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
