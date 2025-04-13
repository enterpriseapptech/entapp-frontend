import { Suspense } from "react";
import UsersDetails from "./UsersDetails";

export default function UsersDetailsPage() {
  return (
    <Suspense fallback={<div>Loading user details...</div>}>
      <UsersDetails />
    </Suspense>
  );
}