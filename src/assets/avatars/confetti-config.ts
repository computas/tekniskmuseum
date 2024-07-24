import { CustomColorsIO } from '@/app/shared/customColors';
import confetti from 'canvas-confetti';

export const confettiDuration = 2 * 1000;
export const confettiSettings = {
  startVelocity: 80,
  particleCount: 300,
  spread: 50,
  colors: [CustomColorsIO.cobaltBlue, CustomColorsIO.hotPink, CustomColorsIO.turquoise, CustomColorsIO.gold],
};

export const iConfettiFigure = confetti.shapeFromPath({
  path: 'M0 226.786L3.92845 23.2139C3.92845 10.3566 13.9283 0 27.1433 0C40.3571 0 50.7139 10.3566 50.7139 23.2139C50.7139 33.2138 44.2855 41.4283 35.3569 45.3568L18.5711 52.5003C9.6432 56.071 3.92845 64.6432 3.92845 74.2855C3.92845 76.7862 3.92845 78.9282 6.07148 85.3572L49.6426 220.001C50.357 222.143 50.7139 224.286 50.7139 226.786C50.7139 239.643 40.3571 250 27.1433 250H23.2138C10.3932 250 0 239.607 0 226.786Z',
});
export const oConfettiFigure = confetti.shapeFromPath({
  path: 'M74.6429 199.285H176.428C189.642 199.285 199.644 187.857 199.644 175.357L199.287 73.9288C199.287 61.0715 188.928 51.0716 176.071 50.7139H74.6429C61.7856 50.7139 51.7859 60.7148 51.0716 73.2145V175.357C51.0716 188.571 61.7856 199.285 74.6429 199.285ZM52.1434 233.571L1.42871 82.1431C0.3577 78.5716 0 76.4285 0 73.9288C0 67.4996 2.85742 61.4281 7.1425 57.4997L57.8572 6.78584C62.1433 2.49998 68.2148 0 74.6429 0H176.071C182.858 0 188.571 2.49998 192.857 6.78584L243.213 57.1431C247.499 61.4281 250 67.4996 250 73.9288C250 76.4285 249.643 78.9282 248.929 81.4287L198.213 233.571V233.929C195.358 242.858 186.43 250 176.071 250H74.6429C64.2856 250 55.3574 242.858 52.1434 233.571Z',
});
