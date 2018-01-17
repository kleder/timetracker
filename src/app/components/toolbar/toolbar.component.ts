import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';
import { setTimeout } from 'timers';
import { webContents } from 'electron';
import { ElectronService } from 'app/providers/electron.service';
import { ToasterService } from 'app/services/toaster.service';
import { DataService } from 'app/services/data.service';
const electron = require("electron")
const { BrowserWindow } = require("electron")
const app = electron.remote.app
const win = electron.remote.getCurrentWindow()
const {remote} = require('electron')
const {Menu, MenuItem} = remote

let mainWindow

import { CustomMenu } from '../../../../src/Menu'
const newMenu = new CustomMenu();

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public isMac: boolean = (process.platform == 'darwin') ? true : false    

  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute,
    public electronService: ElectronService,
    public toasterService: ToasterService,
    public dataService: DataService
  )
  {
    console.log(process.env)
   }
  ngOnInit() {
    console.log('current route', this.router.url.split('?')[0])
  }

  closeApp() {
    app.quit()
  }

  minimizeApp() {
    win.minimize()
  }
  
  showMenu() {
      const template = newMenu.initMenu(app, remote.getCurrentWindow())
      const menu = Menu.buildFromTemplate(template)
      menu.popup(remote.getCurrentWindow())
  }

}
