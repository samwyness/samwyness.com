'use client';

import React from 'react';
import { subscribeToClock } from './LocalTime';
import { Sticker, StickerName } from './Sticker';

// What Sam's probably up to right now, Sunshine Coast time
const SLOTS: { from: number; name: StickerName; label: string }[] = [
  { from: 5, name: 'coffee', label: 'Morning coffee' },
  { from: 11, name: 'headphones', label: 'Headphones on' },
  { from: 17, name: 'taco', label: 'Taco time' },
  { from: 21, name: 'owl', label: 'Night owl' },
];

const getHour = () =>
  Number(
    new Date().toLocaleString('en-AU', {
      timeZone: 'Australia/Brisbane',
      hour: 'numeric',
      hourCycle: 'h23',
    }),
  );

const getSlot = (hour: number) =>
  SLOTS.findLast((slot) => hour >= slot.from) ?? SLOTS[SLOTS.length - 1];

type TimeOfDayStickerProps = {
  className?: string;
  rotate?: number;
};

/** Sticker that changes with Sam's local time of day */
export function TimeOfDaySticker(props: TimeOfDayStickerProps) {
  // -1 on the server so the sticker only appears once the client knows the time
  const hour = React.useSyncExternalStore(subscribeToClock, getHour, () => -1);

  if (hour < 0) return null;

  const { name, label } = getSlot(hour);

  return <Sticker key={name} name={name} label={label} {...props} />;
}
