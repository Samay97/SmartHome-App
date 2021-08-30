import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RGB } from '../core/DTO';
import { ColorConverterService } from '../core/services';


@Component({
  selector: 'app-home',
  templateUrl: './tray.component.html',
  styleUrls: ['./tray.component.scss']
})
export class TrayComponent implements OnInit  {

  public setColorValue: RGB = null;
  public favColors: Array<RGB> = [];

  constructor(private colorConvert: ColorConverterService) { }

  public ngOnInit(): void {
    // Test data
    this.favColors = [
      {
        r: 82,
        g: 255,
        b: 136
      },
      {
        r: 48,
        g: 95,
        b: 114
      },
      {
        r: 255,
        g: 41,
        b: 53
      },
      {
        r: 41,
        g: 128,
        b: 185
      },
      {
        r: 255,
        g: 255,
        b: 255
      }];
  }

  public convertRGBToHex(color: RGB): string {
    return this.colorConvert.rgbToHex(color.r, color.g, color.b);
  }

  public onFavColorClicked(color: RGB): void {
    this.setColorValue = color;
  }

  public onColorChange(color: any): void {
    console.log(JSON.stringify(color, null, 4));
  }
}
