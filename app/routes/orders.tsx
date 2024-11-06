import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");

  if (orderId) {
    // Redirect to /orders/$orderId, preserving other query parameters
    return redirect(`/orders/${orderId}`);
  } else {
    // Handle missing orderId
    return new Response("Order ID is missing", { status: 400 });
  }
};

export default function Orders() {
  // This component might not render anything since we're redirecting
  return <></>;
}
