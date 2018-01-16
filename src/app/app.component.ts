import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { ToasterService } from './services/toaster.service';
import { Router } from '@angular/router';
import { DataService } from './services/data.service'
import { DatabaseService } from './services/database.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    public toasterService: ToasterService,
    public router: Router,
    public dataService: DataService,
    public databaseService: DatabaseService
  ) {
    if (electronService.isElectron()) {
      console.log('Mode electron');
      // Check if electron is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.ipcRenderer);
      // Check if nodeJs childProcess is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }


}
