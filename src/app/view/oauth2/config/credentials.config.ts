import { Injectable } from '@angular/core';
import { OAuth2Component } from '../oauth2.component';

@Injectable()
export class CredentialsConfig
{
    private _oauth2Component:OAuth2Component;

    public get oauth2Component():OAuth2Component
    {
        return this._oauth2Component;
    }

    public set oauth2Component(oauth2Component:OAuth2Component)
    {
        this._oauth2Component = oauth2Component;
    }
}