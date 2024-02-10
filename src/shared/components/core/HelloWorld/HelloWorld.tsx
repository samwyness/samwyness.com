'use client';

import React from 'react';
import { GlobeIcon } from '../../icons/GlobeIcon';
import styles from './HelloWorld.module.css';

const HelloWorlds = [
  'Say hello!',
  '¡Di hola!',
  "Kon'nichiwa to iu!",
  'Dis bonjour!',
  'Sag Hallo!',
  'Di Ciao!',
];

const formatTime = (date: Date) =>
  date
    .toLocaleTimeString('en-AU', {
      timeZone: 'Australia/Brisbane',
      hour: 'numeric',
      minute: '2-digit',
    })
    .replaceAll(' ', '')
    .toUpperCase();

export function HelloWorld() {
  const [timeNow, setTimeNow] = React.useState('');

  React.useEffect(() => {
    setTimeNow(formatTime(new Date()));

    const unsubscribe = setInterval(
      () => setTimeNow(formatTime(new Date())),
      30 * 1000,
    );

    return () => {
      clearInterval(unsubscribe);
    };
  }, []);

  return (
    <div className={styles.helloWorld}>
      <span className={styles.title}>{HelloWorlds[0]}</span>

      <div className={styles.location}>
        <GlobeIcon className={styles.globeIcon} />

        <div className={styles.locationText}>
          Sunshine Coast, Australia
          <time>{timeNow}</time>
        </div>
      </div>
    </div>
  );
}
