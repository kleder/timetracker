import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'app/services/toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {

  constructor(
    public toasterService: ToasterService
  ) { }

  ngOnInit() {
  }


}
