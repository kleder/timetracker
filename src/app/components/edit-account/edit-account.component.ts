import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showEditBoard() {
    document.getElementById('edit-board').className = "show";
  }

  hideEditBoard() {
    document.getElementById('edit-board').className = document.getElementById('edit-board').className.replace("show", "hide")
  }

}
