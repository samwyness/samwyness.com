'use client';

import React from 'react';

const formatTime = (date: Date) =>
  date
    .toLocaleTimeString('en-AU', {
      timeZone: 'Australia/Brisbane',
      hour: 'numeric',
      minute: '2-digit',
    })
    // .replaceAll(' ', '')
    .toUpperCase();

export const subscribeToClock = (onTick: () => void) => {
  const interval = setInterval(onTick, 30 * 1000);
  return () => clearInterval(interval);
};

/** Sunshine Coast local time, ticks every 30s */
export function LocalTime(props: React.HTMLAttributes<HTMLTimeElement>) {
  const timeNow = React.useSyncExternalStore(
    subscribeToClock,
    () => formatTime(new Date()),
    () => '',
  );

  return <time {...props}>{timeNow}</time>;
}
