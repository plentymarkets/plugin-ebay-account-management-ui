import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TerraLoadingSpinnerService, TerraBaseService } from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService extends TerraBaseService
{
    private bearer = "";

    constructor(loadingSpinnerService:TerraLoadingSpinnerService, http:Http)
    {
        super(loadingSpinnerService, http, '/rest/markets/ebay/auth/');
    }

    public getLoginUrl(environment:string):Observable<any>
    {
        let url:string;

        this.setAuthorization();
        this.setHeader();

        url = this.url + 'login?sandbox=' + AuthenticationService.isSandbox(environment);

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
        );
    }

    private static isSandbox(environment:string):number
    {
        return environment == 'sandbox' ? 1 : 0;
    }

    private setHeader()
    {
        if(this.bearer != null && this.bearer.length > 0)
        {
            this.headers.set('Authorization', 'Bearer ' + this.bearer);
        }
    }
}
