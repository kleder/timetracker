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

  // showMenu() {
  //   this.router.navigate(["/menu"], { queryParams: { returnUrl: this.router.url } })
  // }

  closeApp() {
    app.quit()
  }

  minimizeApp() {
    win.minimize()
  }
  
  showMenu() {
      const menu = new Menu()
      let that = this;
      menu.append(new MenuItem({
        label: 'Workspace',
        click() {
          that.router.navigate(['/tracking'])
        }
      }))
      menu.append(new MenuItem({
          label: 'Accounts',
          submenu: [
            {
              label: 'Add Account',
              click() {
                that.router.navigate(['add-account'], { queryParams: {firstAccount: false} })                
              }
            },
            { 
              label: 'Switch Account',
              click() {
                that.router.navigate(['/switch-account'])            
              }
            }
          ]
        }))
      menu.append(new MenuItem({
        label: 'About',
        click() {
          that.router.navigate(['/about-trec'])
        }
      }))
      menu.append(new MenuItem({
        label: 'Licences',
        click() {
          that.router.navigate(['/licenses'])
        }
      }))
      menu.append(new MenuItem({
        label: 'Quit',
        click() {
          app.quit()
        }
     
      }))

      // const { inputFieldType } = props;
      
      // InputMenu.popup(mainWindow, props);

     
      
      menu.popup(remote.getCurrentWindow())
      
  }


}
