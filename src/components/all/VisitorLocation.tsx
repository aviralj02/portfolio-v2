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
    <div className="bg-card rounded-2xl flex items-center justify-center gap-4 px-4 card-shadow">
      <MapPinned className="hidden lg:block w-7 h-7" />

      <div className="flex flex-col lg:text-sm text-xs font-mono sm:tracking-wide select-none">
        <span>
          Last Visited<span className="hidden sm:inline-block">&nbsp;from</span>
          <span className="inline-block sm:hidden">:</span>
        </span>

        {lastLocation ? (
          <span>{lastLocation?.city + ", " + lastLocation?.country}</span>
        ) : (
          <span className="animate-bounce mt-2">Detecting ...</span>
        )}
      </div>
    </div>
  );
};

export default VisitorLocation;
