"use client";

import { Button } from "@/components/ui/button";
import { setBookingStatus } from "@/lib/bookings";

export function BookingControls({ id }: { id: string }) {
  return (
    <div className="mt-3 flex gap-2">
      <Button type="button" size="sm" onClick={() => setBookingStatus(id, "approved")}>
        Approve
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={() => setBookingStatus(id, "declined")}>
        Decline
      </Button>
    </div>
  );
}
