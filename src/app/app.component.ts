import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from './core/services';
import { APP_CONFIG } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    console.log('APP_CONFIG', APP_CONFIG);
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.redirect) {
        switch (params.redirect) {
          case 'traywindow':
            break;
          case 'home':
            this.router.navigate(['home']);
            break;
        }
      }
    });

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      // console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      // console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }
}
