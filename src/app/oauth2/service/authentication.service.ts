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
        // TODO: delete
        this.headers.append('Authorization', 'Bearer sgMMWSi1d5g1Ymh7NtYNVeF6hpBrUKsXlEhZGlEC');

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
        );
    }

    // TODO
    public refreshToken(credentialsId:number, environment:string):Observable<any>
    {
        let url:string;

        this.setAuthorization();

        url = this.url + 'refresh-token?credentialsId=' + credentialsId;

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
        );
    }

    private isSandbox(environment:string):boolean
    {
        return environment == 'sandbox';
    }
}
