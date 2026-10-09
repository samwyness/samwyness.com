import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import pageData from './page-data.json';

export const alt = 'Sam Wyness ~ Software Engineer & Product Designer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Mirrors globals.css dark theme tokens
const SURFACE = '#1a1a1b';
const ON_SURFACE = 'rgb(240, 230, 217)';
const ON_SURFACE_MUTED = 'rgba(240, 230, 217, 0.35)';
const BRAND = '#f03933';
const BLINKER = '#4bc893';

const PADDING = 56;
const PORTRAIT_HEIGHT = size.height - PADDING * 2;
const PORTRAIT_WIDTH = (PORTRAIT_HEIGHT * 2) / 3;

const font = (weight: number) =>
  readFile(
    join(
      process.cwd(),
      `node_modules/@fontsource/funnel-display/files/funnel-display-latin-${weight}-normal.woff`,
    ),
  );

export default async function OpengraphImage() {
  const [light, regular, semibold, bold, portrait] = await Promise.all([
    font(300),
    font(400),
    font(600),
    font(700),
    readFile(join(process.cwd(), 'src/shared/assets/og-portrait.jpg')),
  ]);

  const portraitSrc = `data:image/jpeg;base64,${portrait.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: PADDING,
          gap: PADDING,
          background: SURFACE,
          color: ON_SURFACE,
          fontFamily: 'Funnel Display',
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <div style={{ display: 'flex', fontSize: 36, fontWeight: 400 }}>
            <span style={{ color: BRAND, fontWeight: 700 }}>SW</span>
            <span>.STUDIO</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 168,
                lineHeight: 0.88,
                letterSpacing: -2,
              }}>
              <span style={{ fontWeight: 600 }}>Sam</span>
              <span style={{ fontWeight: 300, color: ON_SURFACE_MUTED }}>
                Wyness
              </span>
            </div>

            <span style={{ paddingLeft: 4, fontSize: 28 }}>
              {pageData.role}
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                paddingLeft: 4,
                fontSize: 22,
                fontWeight: 600,
              }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 12,
                  background: BLINKER,
                  boxShadow: `0 0 12px ${BLINKER}`,
                }}
              />
              <span>Available for hire</span>
              <span style={{ color: ON_SURFACE_MUTED, fontWeight: 400 }}>
                ~ samwyness.com
              </span>
            </div>
          </div>
        </div>

        <img
          src={portraitSrc}
          alt=""
          width={PORTRAIT_WIDTH}
          height={PORTRAIT_HEIGHT}
          style={{ objectFit: 'cover' }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Funnel Display', data: light, weight: 300 },
        { name: 'Funnel Display', data: regular, weight: 400 },
        { name: 'Funnel Display', data: semibold, weight: 600 },
        { name: 'Funnel Display', data: bold, weight: 700 },
      ],
    },
  );
}
