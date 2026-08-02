"use client";

import ContractOverview from "@/components/ContractOverview";
import NotificationToggles from "@/components/NotificationToggles";

export default function Home() {
  return <ContractOverview title="BorrowLend — Production (Polygon Mainnet)" extra={<NotificationToggles />} />;
}
