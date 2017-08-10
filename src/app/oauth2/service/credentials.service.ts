import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TerraLoadingSpinnerService, TerraBaseService } from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { CredentialsData } from '../data/credentials-data';

@Injectable()
export class CredentialsService extends TerraBaseService
{
    private bearer = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImViMzZlMDY1YWFlYzExYmMwODgwZmI5Y2YxMjU1MmFkZDRmMDRmNjE3NmI4NDBjYjgxNjI5YzYxMGM0ZDZiZDJlMWFlZjQ3YjAxYjhmMGVlIn0.eyJhdWQiOiIxIiwianRpIjoiZWIzNmUwNjVhYWVjMTFiYzA4ODBmYjljZjEyNTUyYWRkNGYwNGY2MTc2Yjg0MGNiODE2MjljNjEwYzRkNmJkMmUxYWVmNDdiMDFiOGYwZWUiLCJpYXQiOjE1MDIzNjg5MDUsIm5iZiI6MTUwMjM2ODkwNSwiZXhwIjoxNTAyNDU1MzA0LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.j-E9IUew8GPbZrhPsvv-oGlWxIoA6ZNES_PE16cxgWElaXShg1ggWDCKGWwJbu-h8zq0e7OPj3H4X1TJ9ztI4PLoIcfIxgummKvfh1hX5pX-R05MO_Kjn1fPA1lxddQ7MXRGHlcuBvWkQlfONYvodBK-zgkMSSHmdJCVXPw-hYwK6s0JPEkpJ9g5667Zx_sbpI4MqyIwExdT4av3MwEKgq9krRT9yMJJtZAOb7gxXcJWOIdO1peQvPj8HcnQ7F-ZVG8RisEXH7w_C36QSuKtmbaJ-0-rlN1TQ77rVCe3Ws01c59--xaNQFkvMuFGiJDrU_h9PkAFZoyYZI9OLtcA4cpPclwdbJ1UvvNYrh6sR1fGjQg9sF3BYMAPewHRo-VvcJzoddbOK6ZjTAwSECOaiu-PA2cxye87iOoyWBv0Fo_qdhos0dLZOHqnxySzLpCmj9lOqWRobmgUh-y3IC-XUp-WfqobyerCuJXmLBWDCSz8RVXcj1zBaUhnzbq9cEaUtCDV-p0jOL6BMO2ljBJAv7Tq9OeyuuVNw5DypfUuFzUyzJRVzWfheS6sEJeADLKTTAALUs7i94Psd4QtpFxEoyB08SyFNdZFU4qSb_j9BYJcld1qAoJn_sWeYZgzTBfkHtmzC1Hq3EeemuWs3W2lo9N_hrJaYCj2NptQKwE2MUc";

    constructor(loadingBarService:TerraLoadingSpinnerService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/credentials/');
    }

    public search():Observable<CredentialsData>
    {
        let url:string;

        this.setAuthorization();
        this.setHeader();

        url = this.url + '?market=ebay&data[authType]=oauth2';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
        );
    }

    public save(credentialsId:number, credentialsData:any):Observable<CredentialsData>
    {
        let url: string;

        this.setAuthorization();

        url = this.url + credentialsId;

        return this.mapRequest(
            this.http.put(url, credentialsData, {headers: this.headers})
        );
    }

    public remove(id:number):Observable<CredentialsData>
    {
        let url:string;

        this.setAuthorization();

        url = this.url + id;

        return this.mapRequest(
            this.http.delete(url, {headers: this.headers})
        );
    }

    private setHeader()
    {
        if(this.bearer != null && this.bearer.length > 0)
        {
            this.headers.set('Authorization', 'Bearer ' + this.bearer);
        }
    }
}