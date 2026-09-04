"use client";

import { useEffect, useState } from "react";

import { MapPin } from "lucide-react";

import getLastVisitor from "@/lib/utils/get-last-visitor";
import updateLastVisitor from "@/lib/utils/update-last-visitor";

const VisitorLocation = () => {
  const [previous, setPrevious] = useState<LocationData | null>();

  useEffect(() => {
    let cancelled = false;

    const exchange = async () => {
      const seen = (await getLastVisitor())?.[0] ?? null;
      if (cancelled) return;
      setPrevious(seen);

      const endpoint = process.env.NEXT_PUBLIC_LOCATION_ENDPOINT;
      if (!endpoint) return;

      try {
        const response = await fetch(endpoint);
        if (!response.ok) return;

        const { city, country } = await response.json();
        if (!city || !country) return;

        /* Nothing to write if the last visitor was from here too. */
        if (city === seen?.city && country === seen?.country) return;

        await updateLastVisitor(seen?.id ?? "", city, country);
      } catch {
        /* Blocked or offline: the tile still shows who came before. */
      }
    };

    exchange();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="card-glass flex flex-col justify-center gap-1 rounded-2xl bg-card px-5 py-4">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin aria-hidden className="size-3.5 shrink-0" />
        Last visitor
      </span>

      {previous === undefined ? (
        <span
          aria-hidden
          className="mt-0.5 h-4 w-32 animate-pulse rounded-sm bg-muted"
        />
      ) : (
        <span className="truncate text-[15px] font-medium text-primary">
          {previous
            ? `${previous.city}, ${previous.country}`
            : "You're the first"}
        </span>
      )}
    </div>
  );
};

export default VisitorLocation;
