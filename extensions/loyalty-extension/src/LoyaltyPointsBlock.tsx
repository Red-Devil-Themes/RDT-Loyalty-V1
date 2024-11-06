import React, { useEffect, useState } from "react";

import {
  reactExtension,
  POSBlock,
  Text,
  POSBlockRow,
  useApi,
} from "@shopify/ui-extensions-react/point-of-sale";

const LoyaltyPointsBlock = () => {
  const api = useApi<"pos.order-details.block.render">();
  // const [totalPoints, setTotalPoints] = useState(0);
  // const [pointsEarned, setPointsEarned] = useState(0);
  const [orderSubtotal, setOrderSubtotal] = useState<number | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const orderId = api.order.id;
  const serverUrl = "https://totals-faster-boating-isbn.trycloudflare.com";

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Get the session token
        const sessionToken = await api.session.getSessionToken();

        console.log("CLient orderID:", orderId);

        const response = await fetch(`${serverUrl}/orders/${orderId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        setResponseStatus(response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error Response Text:", errorText);
          throw new Error(`Failed to fetch order data: ${errorText}`);
        }

        const data = await response.json();

        if (typeof data.subtotal === "number") {
          setOrderSubtotal(data.subtotal);
          console.log("Order subtotal received:", data.subtotal);
        } else {
          console.error("No subtotal available in the response.");
        }
      } catch (error) {
        console.error("Error fetching order data in client:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [api, orderId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (orderSubtotal === null) {
    return <Text>Unable to fetch order subtotal.</Text>;
  }
  // useEffect(() => {
  //   async function fetchPoints() {
  //     if (!customer) return;
  //     const points = await getCustomerPoints(customer);
  //     setTotalPoints(points);
  //   }
  //   fetchPoints();
  // }, [customer]);

  // const handleAddPoints = useCallback(async () => {
  //   if (customer) {
  //     const points = await getCustomerPoints(customer);
  //     const subtotal = parseInt(cart?.subtotal || "0");
  //     const pointsToAdd = Math.floor(subtotal / 100);
  //     setPointsEarned(pointsToAdd);
  //     await addOrUpdateCustomerPoints(customer, points + pointsToAdd);
  //     const updatedPoints = await getCustomerPoints(customer);
  //     setTotalPoints(updatedPoints);
  //   } else {
  //     console.error("No customer found");
  //   }
  // }, [cart, customer]);

  // useEffect(() => {
  //   async function initializePoints() {
  //     await handleAddPoints();
  //   }
  //   initializePoints();
  // }, [handleAddPoints]);

  return (
    <POSBlock>
      <POSBlockRow>
        <Text variant="sectionHeader">Loyalty Points</Text>
        <Text variant="body">OrderId: {orderId}</Text>
        <Text variant="body">Order Amount: {orderSubtotal}</Text>
        <Text variant="body">Response Status: {responseStatus}</Text>
      </POSBlockRow>
    </POSBlock>
  );
};

export default reactExtension("pos.order-details.block.render", () => (
  <LoyaltyPointsBlock />
));
