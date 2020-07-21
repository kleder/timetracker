import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { AccountService } from '../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';
import { ElectronService } from '../../providers/electron.service';
import { ToasterService } from '../../services/toaster.service';
import { DataService } from '../../services/data.service';
const electron = require("electron")
const app = electron.remote.app
const win = electron.remote.getCurrentWindow()
const { remote } = require('electron')
const { Menu } = remote
import { CustomMenu } from '../../../../src/Menu'

const newMenu = new CustomMenu();

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public isMac: boolean = (process.platform == 'darwin') ? true : false
  public current = false;

  constructor(
    public http: HttpClient,
    public account: AccountService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public electronService: ElectronService,
    public toasterService: ToasterService,
    public dataService: DataService) {
  }
  async ngOnInit() {
    this.account.CurrentAccount.subscribe(data => {
      this.current = data.url !== undefined && data.url.trim() !== ''
    });
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
    menu.popup()
  }

}
