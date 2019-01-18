import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';

import { DatePipe } from '@angular/common';


import { DataService } from './services/data.service'
import { TimerService } from './services/timer.service'
import { DatabaseService } from './services/database.service'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpService } from './services/http.service';
import { SecondsToTimePipe } from './pipes/seconds-to-time.pipe';


import { ToasterService } from './services/toaster.service';

import { MenuService } from './services/menu.service';
import { Nl2brPipe } from 'app/pipes/nl2br.pipe';
import { EstimationPipe } from './pipes/estimation.pipe';
import { SpinnerService } from './services/spinner.service'
import { JiraComponent } from './components/accounts/add-account/jira/jira.component';
import { AddAccountComponent } from './components/accounts/add-account/add-account.component';
import { YouTrackAccount } from './models/YouTrackAccount';
import { YoutrackComponent } from './components/accounts/add-account/youtrack/youtrack.component';
import { ApiProviderService } from './services/api/api-provider.service';
import { UrlParserService } from './services/url-parser.service';
import { MapToIterable } from './pipes/map-to-iterable.pipe';
import { ApiInitService } from './services/api/api-init.service';
import { ToasterComponent } from './components/toaster/toaster.component';
import { BoardsChoiceComponent } from './components/boards-choice/boards-choice.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { RecordsComponent } from './components/workspace/records/records.component';
import { BoardsComponent } from './components/workspace/boards/boards.component';
import { ColorService } from './services/color.service';
import { RecordCollectionService } from './services/record-collection.service';
import { DateService } from './services/date.service';
import { SortedMapToIterable } from './pipes/sorted-map-to-iterable.pipe';
import { RecordHeaderDate } from './pipes/record-header-date.pipe';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ChangeAccountTokenComponent } from './components/accounts/change-account-token/change-account-token.component';
import { EditAccountComponent } from './components/accounts/edit-account/edit-account.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { SwitchAccountComponent } from './components/accounts/switch-account/switch-account.component';
import { DbMemoryCacheService } from './services/db-memory-cache.service';

@NgModule({
  declarations: [
    AppComponent,
    SecondsToTimePipe,
    Nl2brPipe,
    EstimationPipe,
    AddAccountComponent,
    JiraComponent,
    YoutrackComponent,
    MapToIterable,
    ToasterComponent,
    BoardsChoiceComponent,
    LoadingSpinnerComponent,
    WorkspaceComponent,
    RecordsComponent,
    BoardsComponent,
    SortedMapToIterable,
    RecordHeaderDate,
    ToolbarComponent,
    EditAccountComponent,
    ChangeAccountTokenComponent,
    EditProjectComponent,
    SwitchAccountComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
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
    MenuService,
    SpinnerService,
    ApiProviderService,
    UrlParserService,
    ApiInitService,
    ColorService,
    RecordCollectionService,
    DateService,
    DbMemoryCacheService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
