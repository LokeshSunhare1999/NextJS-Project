import { Suspense } from "react";
import CreditsConfirmationScreen from "./_components/creditsConfirmationScreen";

export default function ConfirmCreditsPaymentPage() {
  return (
    <Suspense>
      <CreditsConfirmationScreen />
    </Suspense>
  );
}
