"use client";

import getLastVisitor from "@/lib/utils/get-last-visitor";
import updateLastVisitor from "@/lib/utils/update-last-visitor";
import { MapPinned } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {};

const VisitorLocation = (props: Props) => {
  const [lastLocation, setLastLocation] = useState<LocationData>();

  const fetchLastLocation = async () => {
    const lastVisit = await getLastVisitor();
    setLastLocation(lastVisit?.[0]);
  };

  const fetchAndUpdateLocation = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_LOCATION_ENDPOINT as string,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    const { city, country } = data;

    if (city === lastLocation?.city && country === lastLocation?.country) {
      return;
    }

    const isSuccessUpdate = await updateLastVisitor(
      lastLocation?.id!,
      city,
      country
    );

    if (!isSuccessUpdate) {
      console.log("Failed to update visitor location");
    }
  };

  useEffect(() => {
    fetchLastLocation();
  }, []);

  useEffect(() => {
    if (lastLocation) {
      fetchAndUpdateLocation();
    }
  }, [lastLocation]);

  return (
    <div className="bg-card rounded-2xl flex items-center justify-center gap-4 px-5 py-3 card-shadow transition-all hover:scale-[1.02]">
      <MapPinned className="hidden lg:block w-7 h-7 text-muted-foreground" />

      <div className="flex flex-col text-xs lg:text-sm font-mono tracking-wide select-none">
        <span className="text-muted-foreground">
          Last Visited
          <span className="hidden sm:inline">&nbsp;from</span>
          <span className="inline sm:hidden">:</span>
        </span>

        {lastLocation ? (
          <span className="font-semibold">
            {lastLocation.city}, {lastLocation.country}
          </span>
        ) : (
          <span className="animate-pulse mt-1 text-primary">Detecting...</span>
        )}
      </div>
    </div>
  );
};

export default VisitorLocation;
