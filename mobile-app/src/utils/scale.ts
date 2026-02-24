import { Dimensions } from 'react-native';

export const DESIGN_WIDTH = 412;
export const DESIGN_HEIGHT = 917;

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const scale = width / DESIGN_WIDTH;
export const verticalScale = height / DESIGN_HEIGHT;

export const s = (v: number) => v * scale;
export const vs = (v: number) => v * verticalScale;

export const ms = (v: number, factor = 0.5) => v + (s(v) - v) * factor;
