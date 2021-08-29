import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './tray.component.html',
  styleUrls: ['./tray.component.scss']
})
export class TrayComponent implements OnInit  {

  public size = 2;

  constructor(private router: Router) { }

  public ngOnInit(): void {
    this.size = window.screen.width;
  }

  public onColorChange(color: any): void {
    console.log(JSON.stringify(color, null, 4));
  }
}
