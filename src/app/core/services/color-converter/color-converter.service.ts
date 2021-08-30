import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorConverterService {

  constructor() {  }

  private static componentToHex(c): string {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  public rgbToHex(r, g, b): string {
    return '#' +
      ColorConverterService.componentToHex(r) +
      ColorConverterService.componentToHex(g) +
      ColorConverterService.componentToHex(b);
  }
}
