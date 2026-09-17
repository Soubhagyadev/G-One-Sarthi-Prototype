import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

declare module '*.svg' {
  const content: FC<SvgProps>;
  export default content;
}
