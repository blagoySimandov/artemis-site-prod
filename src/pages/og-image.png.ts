import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const BACKGROUND = '#182132';
const CREAM = '#eeeae1';
const ACCENT = '#8B9EB0';

async function fetchFont(weight: 300 | 600): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' } }
  ).then(r => r.text());

  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`No TTF/OTF found in Google Fonts CSS for weight ${weight}`);

  return fetch(match[1]).then(r => r.arrayBuffer());
}

function buildMarkup() {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '1200px',
        height: '630px',
        backgroundColor: BACKGROUND,
        padding: '80px',
        fontFamily: 'Inter',
      },
      children: [
        renderTop(),
        renderBottom(),
      ],
    },
  };
}

function renderTop() {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', flexDirection: 'column', gap: '24px' },
      children: [
        renderEyebrow(),
        renderHeadline(),
        renderSubtext(),
      ],
    },
  };
}

function renderEyebrow() {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: '32px',
              height: '2px',
              backgroundColor: ACCENT,
            },
          },
        },
        {
          type: 'span',
          props: {
            style: {
              color: ACCENT,
              fontSize: '16px',
              fontWeight: 300,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            },
            children: 'Luxembourg · Private Equity',
          },
        },
      ],
    },
  };
}

function renderHeadline() {
  return {
    type: 'div',
    props: {
      style: {
        color: CREAM,
        fontSize: '72px',
        fontWeight: 600,
        lineHeight: 1.05,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      },
      children: 'Artemis Capital Partners',
    },
  };
}

function renderSubtext() {
  return {
    type: 'div',
    props: {
      style: {
        color: ACCENT,
        fontSize: '24px',
        fontWeight: 300,
        lineHeight: 1.4,
        maxWidth: '700px',
      },
      children: 'Investing in established European defence & dual-use technology companies.',
    },
  };
}

function renderBottom() {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      },
      children: [
        renderCTA(),
        renderDomain(),
      ],
    },
  };
}

function renderCTA() {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        backgroundColor: CREAM,
        color: BACKGROUND,
        padding: '16px 32px',
        fontSize: '18px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      children: 'Explore Our Approach →',
    },
  };
}

function renderDomain() {
  return {
    type: 'div',
    props: {
      style: {
        color: ACCENT,
        fontSize: '16px',
        fontWeight: 300,
        letterSpacing: '0.1em',
      },
      children: 'artemispartners.eu',
    },
  };
}

export const GET: APIRoute = async () => {
  const fontData = await fetchFont(300);

  const svg = await satori(buildMarkup() as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontData, weight: 300, style: 'normal' },
      { name: 'Inter', data: fontData, weight: 600, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=604800',
    },
  });
};
