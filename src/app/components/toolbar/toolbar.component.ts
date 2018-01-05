import { Component, OnInit } from '@angular/core';
import { remote } from 'electron'
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public isMac: boolean = (process.platform == 'darwin') ? true : false    
  private win;
  constructor() {
    this.win = remote.getCurrentWindow();
  }

  ngOnInit() {
      }

  closeApp() {
      //electron.remote.app.quit()
      this.win.close();
      console.log("close")
  }

  minimizeApp() {
    
    this.win.minimize();
  }

  fullScreen() {
    
    this.win.maximize();
  }

}
