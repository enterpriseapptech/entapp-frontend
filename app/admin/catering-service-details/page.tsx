import { Suspense } from "react";
import CateringServiceDetails from "./CateringServiceDetails";

export default function CateringServiceDetailsPage() {
  return (
    <Suspense fallback={<div>Loading catering service details...</div>}>
      <CateringServiceDetails />
    </Suspense>
  );
}