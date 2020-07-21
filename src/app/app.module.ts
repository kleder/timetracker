import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';

import { DatePipe } from '@angular/common';

import { BoardsComponent } from './components/workspace/boards/boards.component';
import { RecordsComponent } from './components/workspace/records/records.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { BoardsChoiceComponent } from './components/boards-choice/boards-choice.component';
import { AboutComponent } from './components/about/about.component';

import { DataService } from './services/data.service'
import { TimerService } from './services/timer.service'
import { DatabaseService } from './services/database.service'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpService } from './services/http.service';
import { SecondsToTimePipe } from './pipes/seconds-to-time.pipe';

import { AddAccountComponent } from './components/accounts/add-account/add-account.component';
import { EditAccountComponent } from './components/accounts/edit-account/edit-account.component';
import { EditBoardComponent } from './components/edit-board/edit-board.component';
import { LicensesComponent } from './components/licenses/licenses.component';
import { ChangeAccountTokenComponent } from './components/accounts/change-account-token/change-account-token.component';

import { ToasterService } from './services/toaster.service';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SwitchAccountComponent } from './components/accounts/switch-account/switch-account.component'
import { MenuService } from './services/menu.service';
import { Nl2brPipe } from './pipes/nl2br.pipe';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ToasterComponent } from './components/toaster/toaster.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
    BoardsComponent,
    RecordsComponent,
    BoardsChoiceComponent,
    SecondsToTimePipe,
    Nl2brPipe,
    AddAccountComponent,
    EditAccountComponent,
    EditBoardComponent,
    AboutComponent,
    ChangeAccountTokenComponent,
    LicensesComponent,
    ToolbarComponent,
    SwitchAccountComponent,
    LoadingSpinnerComponent,
    ToasterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    ElectronService, 
    DatePipe,
    DataService,
    TimerService,
    DatabaseService,
    HttpService,
    ToasterService,
    MenuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
