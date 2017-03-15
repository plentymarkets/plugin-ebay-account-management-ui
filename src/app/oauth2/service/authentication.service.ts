import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TerraLoadingBarService, TerraBaseService } from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService extends TerraBaseService
{
    constructor(loadingBarService:TerraLoadingBarService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/ebay/auth/');
    }

    public getLoginUrl(environment:string):Observable<any>
    {
        let url:string;

        this.setAuthorization();

        url = this.url + 'login?sandbox=' + this.isSandbox(environment);

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
        );
    }

    private isSandbox(environment:string):number
    {
        return environment == 'sandbox' ? 1 : 0;
    }
}
