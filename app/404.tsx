import { Suspense } from "react";
import { NavigationEvents } from "./navigatonEvent";

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavigationEvents />
    </Suspense>
  );
}
