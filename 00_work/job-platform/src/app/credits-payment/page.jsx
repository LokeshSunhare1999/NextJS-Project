import { Suspense } from "react";
import CreditsPaymentScreen from "./_components/creditsPaymentScreen";

export default function CreditsPaymentPage() {
  return (
    <Suspense>
      <CreditsPaymentScreen />
    </Suspense>
  );
}
