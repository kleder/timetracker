import { Component, OnInit } from '@angular/core';
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
  constructor() {
  }

  ngOnInit() {
      }

  closeApp() {
    app.quit()
  }

  minimizeApp() {
    win.minimize()
  }

}
