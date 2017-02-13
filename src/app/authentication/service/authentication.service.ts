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
        let isSandbox:number;

        this.setAuthorization();

        isSandbox = environment == 'sandbox' ? 1 : 0;
        url = this.url + 'login?sandbox=' + isSandbox;

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
        );
    }

    public refreshToken(credentialsId:number):Observable<any>
    {
        let url:string;

        this.setAuthorization();

        url = this.url + 'refresh-token?credentialsId=' + credentialsId;

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
        );
    }
}
