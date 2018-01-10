import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';
import { setTimeout } from 'timers';

const electron = require("electron")
const { BrowserWindow } = require("electron")
const app = electron.remote.app
const win = electron.remote.getCurrentWindow()

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public isMac: boolean = (process.platform == 'darwin') ? true : false    
  private win;

  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute,
  )
  {
    console.log(process.env)
   }
  ngOnInit() {
  }

  showMenu() {
    this.router.navigate(["/menu"], { queryParams: { returnUrl: this.router.url } })
  }

  closeApp() {
    app.quit()
  }

  minimizeApp() {
    win.minimize()
  }

}
