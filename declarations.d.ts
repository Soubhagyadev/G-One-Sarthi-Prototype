import { SvgProps } from 'react-native-svg';

declare module '*.svg' {
  const content: (props: SvgProps) => JSX.Element | null;
  export default content;
}
