'use client';

import { useEffect, useState } from 'react';
import { ScrollTextMask } from '../ScrollTextMask';
import { GlobeIcon } from '../icons/GlobeIcon';
import styles from './HelloWorld.module.css';

const HelloWorlds = [
  'Say hello!',
  '¡Di hola!',
  "Kon'nichiwa to iu!",
  'Dis bonjour!',
  'Sag Hallo!',
  'Di Ciao!',
];

export function HelloWorld() {
  const [timeNow, setTimeNow] = useState(new Date());

  const formattedTime = timeNow
    .toLocaleTimeString('en-AU', {
      timeZone: 'Australia/Brisbane',
      hour: 'numeric',
      minute: '2-digit',
    })
    .replaceAll(' ', '')
    .toUpperCase();

  useEffect(() => {
    setInterval(() => setTimeNow(new Date()), 30 * 1000);
  }, []);

  return (
    <div className={styles.helloWorld}>
      <h4 className={styles.title}>
        <ScrollTextMask>{HelloWorlds[0]}</ScrollTextMask>
      </h4>

      <div className={styles.location}>
        <GlobeIcon className={styles.globeIcon} />

        <div className={styles.locationText}>
          <ScrollTextMask>Sunshine Coast, Australia</ScrollTextMask>

          <ScrollTextMask>
            <strong>{formattedTime}</strong>
          </ScrollTextMask>
        </div>
      </div>
    </div>
  );
}
