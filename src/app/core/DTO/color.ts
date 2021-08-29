export interface ColorPicker {
  on: any;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface HSI {
  h: number;
  s: number;
  i: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBW {
  r: number;
  g: number;
  b: number;
  w: number;
}

export interface Colors {
  hsv: HSV;
  rgb: RGB;
  hsi: HSI;
  rgbw: RGBW;
}
