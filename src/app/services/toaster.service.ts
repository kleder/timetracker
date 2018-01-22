import { Injectable } from '@angular/core';

@Injectable()
export class ToasterService {
  private toaster: HTMLElement
  public toasterText: string
  constructor() {
   }

  public showToaster(text: string, type: string) {
    console.log("in showToaster", text)
    this.toaster = document.getElementById("default-notification")
    let that = this
    setTimeout(function() {
      that.toasterText = text
      switch(type) {
        case 'default': {
          that.toaster.className += " show default-notification--default"
          break;
        }
        case 'success': {
          that.toaster.className += " show default-notification--success"
          break;
        }
        case 'error': {
          that.toaster.className += " show default-notification--error"
          break;
        }
      }
      setTimeout(function() { 
        that.toaster.className = that.toaster.className.replace("show", "")
      }, 5500);
    }, 300)
    this.toaster.className = that.toaster.className.replace("default-notification--default", "")
    this.toaster.className = that.toaster.className.replace("default-notification--success", "")
    this.toaster.className = that.toaster.className.replace("default-notification--error", "")
  }
  
  public hideToaster() {
    this.toaster.className = this.toaster.className.replace("show", "")    
  }
}
