import { BoardsChoiceComponent } from './components/boards-choice/boards-choice.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { BoardsComponent } from './components/workspace/boards/boards.component';
import { RecordsComponent } from './components/workspace/records/records.component';
import { AddAccountComponent } from './components/accounts/add-account/add-account.component';
import { SwitchAccountComponent } from './components/accounts/switch-account/switch-account.component';
import { EditAccountComponent } from './components/accounts/edit-account/edit-account.component';
import { EditBoardComponent } from './components/edit-board/edit-board.component';
import { ChangeAccountTokenComponent } from './components/accounts/change-account-token/change-account-token.component';
import { AboutComponent } from './components/about/about.component';
import { LicensesComponent } from './components/licenses/licenses.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountService } from './services/account.service'
import { ApiService } from './services/api.service'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'accounts/add-account',
        pathMatch: 'full',
    },
    {
        path: 'accounts',
        children: [
            {
                path: '',
                component: SwitchAccountComponent,
                pathMatch: 'full'
            },
            {
                path: 'add-account',
                component: AddAccountComponent,
            },
            {
                path: 'edit-account',
                component: EditAccountComponent
            },
            {
                path: 'change-account-token',
                component: ChangeAccountTokenComponent
            },
        ]
    },
    {
        path: 'edit-board',
        component: EditBoardComponent
    },
    {
        path: 'boards',
        component: BoardsChoiceComponent
    },
    {
        path: 'workspace',
        component: WorkspaceComponent,
        children: [
            {
                path: '',
                redirectTo: 'boards',
                pathMatch: 'full'
            },
            {
                path: 'boards',
                component: BoardsComponent
            },
            {
                path: 'records',
                component: RecordsComponent
            },
        ]
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'licenses',
        component: LicensesComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule],
    providers: [
        AccountService,
        ApiService
    ]
})
export class AppRoutingModule { }
