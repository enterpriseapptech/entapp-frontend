import { Suspense } from "react";
import EventCenterDetails from "./EventCenterDetails";

export default function EventCenterDetailsPage() {
  return (
    <Suspense fallback={<div>Loading event center details...</div>}>
      <EventCenterDetails />
    </Suspense>
  );
}