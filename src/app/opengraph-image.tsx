import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { COLORS } from 'src/shared/constants';
import pageData from './page-data.json';

export const alt = 'Sam Wyness ~ Software Engineer & Product Designer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Dark theme
const ON_SURFACE_MUTED = 'rgba(240, 230, 217, 0.3)';
const ON_SURFACE_SUBTLE = 'rgba(240, 230, 217, 0.5)';

const PADDING = 56;
// Hero photo's 450:638, matching og-hero.jpg (a 2x still of its riso print)
const PHOTO_HEIGHT = size.height - PADDING * 2;
const PHOTO_WIDTH = Math.round((PHOTO_HEIGHT * 450) / 638);

const font = (weight: number) =>
  readFile(
    join(
      process.cwd(),
      `node_modules/@fontsource/funnel-display/files/funnel-display-latin-${weight}-normal.woff`,
    ),
  );

export default async function OpengraphImage() {
  const [regular, semibold, bold, photo] = await Promise.all([
    font(400),
    font(600),
    font(700),
    readFile(join(process.cwd(), 'src/shared/assets/og-hero.jpg')),
  ]);

  const photoSrc = `data:image/jpeg;base64,${photo.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: PADDING,
        gap: PADDING,
        background: COLORS.surfaceDark,
        color: COLORS.onSurfaceDark,
        fontFamily: 'Funnel Display',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <span style={{ fontSize: 36, fontWeight: 700 }}>SW.</span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 150,
              lineHeight: 0.88,
              letterSpacing: -2,
            }}>
            <span style={{ fontWeight: 700 }}>Sam</span>
            <span style={{ fontWeight: 400, color: ON_SURFACE_MUTED }}>
              Wyness
            </span>
          </div>

          <span style={{ paddingLeft: 4, fontSize: 28 }}>{pageData.role}</span>

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
                background: COLORS.blinker,
                boxShadow: `0 0 12px ${COLORS.blinker}`,
              }}
            />
            <span>Available for hire</span>
            <span style={{ color: ON_SURFACE_SUBTLE, fontWeight: 400 }}>
              ~ samwyness.com
            </span>
          </div>
        </div>
      </div>

      <img
        src={photoSrc}
        alt=""
        width={PHOTO_WIDTH}
        height={PHOTO_HEIGHT}
        style={{ objectFit: 'cover' }}
      />
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Funnel Display', data: regular, weight: 400 },
        { name: 'Funnel Display', data: semibold, weight: 600 },
        { name: 'Funnel Display', data: bold, weight: 700 },
      ],
    },
  );
}
