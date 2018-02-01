import { Injectable } from '@angular/core';

@Injectable()
export class ToasterService {
  private toaster: any
  public toasterText: string
  constructor() {
  
  }

  public showToaster(text: string, type: string) {
    let that = this
    this.toasterText = text
    this.toaster = document.getElementById("default-notification")
    setTimeout(function() {
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

  public default(text) {
    this.showToaster(text, 'default')
  }

  public success(text) {
    this.showToaster(text, 'success')
  }

  public error(text) {
    this.showToaster(text, 'error')
  }
  
}
