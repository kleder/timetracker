import { OnInit } from "@angular/core";
import { ApiProviderService } from "../services/api/api-provider.service";
import { ApiInitService } from "../services/api/api-init.service";
import { ApiService } from "../services/api/api.service";
import { AccountService } from "../services/account.service";

export class TrecOnInit implements OnInit {

    protected api: ApiService;

    constructor(protected apiProviderService: ApiProviderService,
                protected apiInitService: ApiInitService,
                protected accountService: AccountService){
    }

    async ngOnInit() {
        await this.accountService.tryLogin();
        this.api = this.apiProviderService.getInstance();
    }
}