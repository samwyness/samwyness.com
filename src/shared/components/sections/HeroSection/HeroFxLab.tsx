'use client';

import classNames from 'classnames';
import React from 'react';
import { createPortal } from 'react-dom';
import { COLORS } from 'src/shared/constants';
import { HeroFx } from './HeroFx';
import styles from './HeroFxLab.module.css';
import { reveal, RISO_REVEAL } from './heroFxShaders';

// Extra GLSL for the lab variants, after the shared base
const extras = /* glsl */ `
  // How much a carved line covers uv, 0–1. Boost thickens the lines and
  // inks them fully
  float linoCut(vec2 uv, float boost) {
    vec2 p = uv * uResolution;
    float l = smoothstep(0.08, 0.8, luma(photo(uv)));
    // Lines 4px apart that bend gently with the tones, thicker in the shadows
    float warp = l * 1.0 + fbm(uv * vec2(3.0, 9.0)) * 0.3;
    float v = abs(fract(uv.y * uResolution.y / 4.0 + warp) - 0.5) * 2.0;
    float width = 0.8 + boost * 0.3 - l * 0.9 + (noise(p * 0.04) - 0.5) * 0.1;
    float cut = 1.0 - smoothstep(width - 0.12, width + 0.12, v);
    // Solid blacks, clear whites
    cut = mix(cut, 1.0, smoothstep(0.04 + boost * 0.1, 0.0, l));
    // Ink doesn't quite cover, so the paper shows through
    return mix(cut, 0.0, smoothstep(0.8, 0.92, l)) * (0.75 + boost * 0.25);
  }

  // Carved lines in the given ink, like the stickers
  vec3 lino(vec3 ink, float boost) {
    return mix(uPaper, ink, linoCut(vUv, boost));
  }

  const vec3 AQUA = vec3(0.0, 0.66, 0.88);
`;

// Custom variants take the picked colour and strength
const custom = (print: string) =>
  extras +
  reveal(`${print}(uSpot, max(uAmount - 1.0, 0.0))`, 'min(uAmount, 1.0)');

const FX = [
  { value: 'none', label: 'None', fragment: '' },
  { value: 'riso-reveal', label: 'Riso reveal', fragment: RISO_REVEAL },
  {
    value: 'lino-reveal',
    label: 'Lino reveal',
    fragment: extras + reveal('lino(uInk, 0.0)'),
  },
  {
    value: 'cyan-reveal',
    label: 'Cyan reveal',
    fragment: extras + reveal('riso(AQUA, 0.0)', '0.5'),
  },
  { value: 'custom-riso', label: 'Custom riso', fragment: custom('riso') },
  { value: 'custom-lino', label: 'Custom lino', fragment: custom('lino') },
] as const;

type Fx = (typeof FX)[number]['value'];

// The shipped variant, so no ?fx= shows what production does
const DEFAULT_FX: Fx = 'riso-reveal';

// Variants with the colour and strength controls, and their default colour
const CUSTOM: Partial<Record<Fx, string>> = {
  'custom-riso': COLORS.brand,
  'custom-lino': COLORS.surfaceDark,
};

// Picked effect lives in ?fx=, so a variant can be linked to
const FX_EVENT = 'herofx';

const subscribeFx = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  window.addEventListener(FX_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(FX_EVENT, onChange);
  };
};

const getFx = (): Fx => {
  const value = new URLSearchParams(window.location.search).get('fx');
  return FX.find(option => option.value === value)?.value ?? DEFAULT_FX;
};

const setFx = (value: Fx) => {
  const url = new URL(window.location.href);
  if (value === DEFAULT_FX) url.searchParams.delete('fx');
  else url.searchParams.set('fx', value);
  window.history.replaceState(null, '', url);
  window.dispatchEvent(new Event(FX_EVENT));
};

// Custom variant options, in ?spot= (rrggbb) and ?amount= (0–2, 1 as
// normal), shared between them
const MAX_AMOUNT = 2;
// Live values while dragging a control; the URL catches up after a pause, as
// browsers throttle rapid history writes
const live: Record<string, string> = {};
const timers: Record<string, number> = {};

const getParam = (key: string) =>
  live[key] ?? new URLSearchParams(window.location.search).get(key);

const setParam = (key: string, value: string) => {
  live[key] = value;
  window.dispatchEvent(new Event(FX_EVENT));
  window.clearTimeout(timers[key]);
  timers[key] = window.setTimeout(() => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState(null, '', url);
  }, 300);
};

// Remounts the colour input on reset, closing an open native picker that
// would otherwise apply its colour again when dismissed
let resets = 0;

// Back to the default colour and strength
const resetParams = () => {
  resets++;
  const url = new URL(window.location.href);
  for (const key of ['spot', 'amount']) {
    delete live[key];
    window.clearTimeout(timers[key]);
    url.searchParams.delete(key);
  }
  window.history.replaceState(null, '', url);
  window.dispatchEvent(new Event(FX_EVENT));
};

const getSpot = () => {
  const value = getParam('spot');
  if (value && /^[0-9a-f]{6}$/i.test(value)) return `#${value}`;
  return CUSTOM[getFx()] ?? COLORS.brand;
};

const getAmount = () => {
  const value = Number(getParam('amount') ?? 1);
  return Number.isFinite(value) ? Math.min(Math.max(value, 0), MAX_AMOUNT) : 1;
};

type HeroFxLabProps = {
  className?: string;
  /** Picked variant, for the photo frame's data-fx */
  onFx: (fx: string) => void;
};

/**
 * Dev only: every effect variant, picked from a floating bar, with colour and
 * strength controls for the custom ones. Loaded in place of HeroFx behind the
 * lab flag in HeroPhoto.tsx
 */
export function HeroFxLab({ className, onFx }: HeroFxLabProps) {
  const fx = React.useSyncExternalStore(subscribeFx, getFx, () => DEFAULT_FX);
  const spot = React.useSyncExternalStore(
    subscribeFx,
    getSpot,
    () => COLORS.brand,
  );
  const resetKey = React.useSyncExternalStore(
    subscribeFx,
    () => resets,
    () => 0,
  );
  const amount = React.useSyncExternalStore(subscribeFx, getAmount, () => 1);

  React.useEffect(() => {
    onFx(fx);
  }, [fx, onFx]);

  const { fragment } = FX.find(option => option.value === fx)!;

  return (
    <>
      {fragment && (
        <HeroFx
          key={fx}
          fragment={fragment}
          spot={spot}
          amount={amount}
          className={className}
        />
      )}

      {createPortal(
        <div className={styles.picker} role="radiogroup" aria-label="Effect">
          {FX.map(({ value, label }) => {
            // Pressed again, the custom option resets its colour and strength
            const isReset = value in CUSTOM && fx === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={fx === value}
                className={classNames(
                  styles.pickerOption,
                  fx === value && styles.pickerActive,
                )}
                onClick={() => (isReset ? resetParams() : setFx(value))}>
                {isReset ? 'Reset' : label}
              </button>
            );
          })}
          {fx in CUSTOM && (
            <>
              <label className={styles.swatch} style={{ background: spot }}>
                <input
                  key={resetKey}
                  type="color"
                  value={spot}
                  aria-label="Ink colour"
                  onChange={e => setParam('spot', e.target.value.slice(1))}
                />
              </label>
              <input
                type="range"
                className={styles.amount}
                min={0}
                max={MAX_AMOUNT}
                step={0.05}
                value={amount}
                aria-label="Effect strength"
                onChange={e => setParam('amount', e.target.value)}
              />
              <output className={styles.amountValue}>
                {amount.toFixed(2)}
              </output>
            </>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
