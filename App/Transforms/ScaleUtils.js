import {PixelRatio} from 'react-native';

const scaleValue = PixelRatio.get() / 2;

export const scaleWithPixel = (size, limitScale = 1.15) => {
  /* setting default upto 20% when resolution device upto 20% with defalt iPhone 7 */
  const value = scaleValue > limitScale ? limitScale : scaleValue;
  return size * value;
  // return size;
};
