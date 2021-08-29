import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ColorPicker, Colors, HSI, HSV, RGB, RGBW } from '../../../core/DTO';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let ColorPickerControl: any;


@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit, AfterViewInit {

  @ViewChild('colorContainer')public colorPickerContainer: ElementRef;
  @Output() public onColorChange$: EventEmitter<Colors> = new EventEmitter<Colors>();

  private control: ColorPicker;
  private onColorChange: Subject<HSV> = new Subject<HSV>();
  private colorChangeEvent: Observable<Colors>;

  public ngOnInit(): void {
    this.colorChangeEvent = this.onColorChange.asObservable()
      .pipe(
        debounceTime(250),
        distinctUntilChanged(this.compareHSV),
        map((color: HSV) => this.HSVToColors(color))
      );
    this.colorChangeEvent.subscribe((color: Colors) => this.onColorChange$.next(color));
  }

  public ngAfterViewInit() {
    this.control = new ColorPickerControl({
      container: this.colorPickerContainer.nativeElement,
      theme: 'dark',
      use_alpha: false
    }) as ColorPicker;
    this.control.on('change', (color: HSV) => this.onColorChange.next(color));
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private HSVToColors(color: HSV): Colors {
    const rgb = this.HSVToRGB(color.h, color.s, color.v);
    const hsi = this.RGBToHSI(rgb.r, rgb.g, rgb.b);
    const rgbw = this.HSIToRGBW(hsi.h, hsi.s, hsi.i);

    const colors: Colors = {
      hsv: {
        h: color.h,
        s: color.s,
        v: color.v
      },
      rgb: {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b
      },
      hsi: {
        h: hsi.h,
        s: hsi.s,
        i: hsi.i
      },
      rgbw: {
        r: rgbw.r,
        g: rgbw.g,
        b: rgbw.b,
        w: rgbw.w
      }
    };

    return colors;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private HSVToRGBW(color: HSV): RGBW {
    const rgb = this.HSVToRGB(color.h, color.s, color.v);
    const hsi = this.RGBToHSI(rgb.r, rgb.g, rgb.b);
    return this.HSIToRGBW(hsi.h, hsi.s, hsi.i);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private HSVToRGB(h: number, s: number, v: number): RGB {
    h = h/360;
    s = s/100;
    v = v/100;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r: number;
    let g: number;
    let b: number;

    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private RGBToHSI(r: number, g: number, b: number): HSI {
    r = this.constrain(r / 255.0, 0.0, 1.0);
    g = this.constrain(g / 255.0, 0.0, 1.0);
    b = this.constrain(b / 255.0, 0.0, 1.0);
    const intensity = 0.33333 * (r + g + b);

    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    const C = M - m;

    let saturation = 0.0;
    if (intensity === 0.0) {
      saturation = 0.0;
    } else {
      saturation = 1.0 - (m / intensity);
    }


    let hue = 0;

    if( M === m) {
      hue = 0;
    }

    if (M === r) {
      if (M === m) {
        hue = 0.0;
      } else {
        hue = 60.0 * (0.0 + ((g - b) / (M - m)));
      }
    }

    if (M === g) {
      if (M === m) {
        hue = 0.0;
      } else {
        hue = 60.0 * (2.0 + ((b - r) / (M - m)));
      }
    }

    if (M === b) {
      if (M === m) {
        hue = 0.0;
      } else {
        hue = 60.0 * (4.0 + ((r - g) / (M - m)));
      }
    }

    if (hue < 0.0) {
      hue = hue + 360;
    }


    return {
      h: +hue.toFixed(3),
      s: +Math.abs(saturation).toFixed(3),
      i: +intensity.toFixed(3)
    };
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private HSIToRGBW(H: number, S: number, I: number): RGBW {
    let r = 0;
    let g = 0;
    let b = 0;
    let w = 0;
    let cos_h = 0.0;
    let cos_1047_h = 0.0;

    H = H % 360;
    H = 3.14159 * H / 180.0;
    S = this.constrain(S, 0.0, 1.0);
    I = this.constrain(I, 0.0, 1.0);


    if (H < 2.09439) {
      cos_h = Math.cos(H);
      cos_1047_h = Math.cos(1.047196667 - H);
      r = S * 255.0 * I / 3.0 * (1.0 + cos_h / cos_1047_h);
      g = S * 255.0 * I / 3.0 * (1.0 + (1.0 - cos_h / cos_1047_h));
      b = 0.0;
      w = 255.0 * (1.0 - S) * I;
    } else if ( H < 4.188787) {
      H = H - 2.09439;
      cos_h = Math.cos(H);
      cos_1047_h = Math.cos(1.047196667 - H);
      g = S * 255.0 * I / 3.0 * (1.0 + cos_h / cos_1047_h);
      b = S * 255.0 * I / 3.0 * (1.0 + (1.0 - cos_h / cos_1047_h));
      r = 0.0;
      w = 255.0 * (1.0 - S) * I;
    } else {
      H = H - 4.188787;
      cos_h = Math.cos(H)
      cos_1047_h = Math.cos(1.047196667 - H);
      b = S * 255.0 * I / 3.0 * (1.0 + cos_h / cos_1047_h);
      r = S * 255.0 * I / 3.0 * (1.0 + (1.0 - cos_h / cos_1047_h));
      g = 0.0;
      w = 255.0 * (1.0 - S) * I;
    }

    return {
      r: Math.round(this.constrain(r * 3, 0, 255)),
      g: Math.round(this.constrain(g * 3, 0, 255)),
      b: Math.round(this.constrain(b * 3, 0, 255)),
      w: Math.round(this.constrain(w, 0, 255)),
    };
    // for some reason, the rgb numbers need to be X3...
  }

  private constrain(val: number, min: number, max: number): number {
    let ret = val;
    if(val <= min) {
      ret = min;
    }
    if(val >= max) {
      ret = max;
    }
    return ret;
  }

  private compareHSV(prev: HSV, curr: HSV): boolean {
    return !(prev.h === curr.h && prev.s === curr.s && prev.v === curr.v);
  }
}
