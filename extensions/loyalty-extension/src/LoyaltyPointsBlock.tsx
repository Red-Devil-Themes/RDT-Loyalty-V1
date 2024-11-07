import React, { useEffect, useState } from "react";

import {
  reactExtension,
  POSBlock,
  Text,
  POSBlockRow,
  useApi,
} from "@shopify/ui-extensions-react/point-of-sale";

const LoyaltyPointsBlock = () => {
  const api = useApi<"pos.customer-details.block.render">();
  // const [totalPoints, setTotalPoints] = useState(0);
  // const [pointsEarned, setPointsEarned] = useState(0);
  const [pointsTotal, setPointsTotal] = useState<number | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const customerId = api.customer.id;
  const serverUrl =
    "https://sep-nuts-improvements-revolution.trycloudflare.com";

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Get the session token
        const sessionToken = await api.session.getSessionToken();

        console.log("Client customerId:", customerId);
        console.log("Client sessionToken:", sessionToken);

        const response = await fetch(`${serverUrl}/points/${customerId}`, {
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

        if (typeof data.totalPoints === "number") {
          setPointsTotal(data.totalPoints);
          console.log("Points total received:", data.totalPoints);
        } else {
          console.error("No points available in the response.");
        }
      } catch (error) {
        console.error("Error fetching order data in client:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [api, customerId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (pointsTotal === null) {
    return (
      <POSBlock>
        <POSBlockRow>
          <Text>Unable to fetch points total.</Text>
          <Text variant="body">Response Status: {responseStatus}</Text>
        </POSBlockRow>
      </POSBlock>
    );
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
        <Text variant="body">Customer ID: {customerId}</Text>
        <Text variant="body">Total Points: {pointsTotal}</Text>
        <Text variant="body">Response Status: {responseStatus}</Text>
      </POSBlockRow>
    </POSBlock>
  );
};

export default reactExtension("pos.customer-details.block.render", () => (
  <LoyaltyPointsBlock />
));
