import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TerraLoadingBarService, TerraBaseService } from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { CredentialsData } from '../data/credentials-data';

@Injectable()
export class CredentialsService extends TerraBaseService
{
    constructor(loadingBarService:TerraLoadingBarService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/credentials/');
    }

    public search():Observable<CredentialsData>
    {
        let url:string;

        this.setAuthorization();

        url = this.url + '?market=ebay';
        // TODO: delete
        this.headers.append('Authorization', 'Bearer sgMMWSi1d5g1Ymh7NtYNVeF6hpBrUKsXlEhZGlEC');

        return this.mapRequest(
            this.http.get(url, {headers: this.headers, body: ''})
        );
    }

    public save(credentials:CredentialsData):Observable<CredentialsData>
    {
        let url: string;

        this.setAuthorization();

        url = this.url + credentials.id + '?data=' + credentials;

        return this.mapRequest(
            this.http.put(url, {headers: this.headers, body: ''})
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
}