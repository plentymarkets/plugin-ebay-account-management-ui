import {Component, OnInit, forwardRef, Inject, ViewChild} from '@angular/core';
import { Locale } from 'angular2localization/angular2localization';
import { LocaleService} from 'angular2localization/angular2localization';
import { LocalizationService} from 'angular2localization/angular2localization';
import { CredentialsData } from './data/credentials-data';
import { CredentialsService } from './service/credentials.service';
import { AuthenticationService } from './service/authentication.service';
import { EbayOAuth2AppComponent } from '../ebay-oauth2-app.component';

@Component({
    selector: 'oauth2',
    template: require('./oauth2.component.html'),
    styles: [require('./oauth2.component.scss').toString()]
})

export class OAuth2Component extends Locale implements OnInit
{
    private isLoading:boolean = true;
    private isAccountInputActive:boolean = true;
    private credentialsList:Array<CredentialsData>;

    constructor(
        private credentialService:CredentialsService,
        private authenticationService:AuthenticationService,
        @Inject(forwardRef(() => EbayOAuth2AppComponent)) private ebayOAuth2AppComponent:EbayOAuth2AppComponent,
        locale:LocaleService,
        localization:LocalizationService
    )
    {
        super(locale,localization);

        this.initCredentialsInfoboxes();
    }

    ngOnInit(): void
    {
        this.setLoading(false);
    }

    private setLoading(isLoading:boolean)
    {
        this.ebayOAuth2AppComponent.callLoadingEvent(isLoading);
        this.isLoading = isLoading;
    }

    private reload():void
    {
        location.reload();
    }


    private initCredentialsInfoboxes():void
    {
        this.setLoading(true);

        this.credentialService.search().subscribe(
            response => {
                this.credentialsList = [];

                let entries = response['entries'];

                for (let index in entries) {
                    let data:CredentialsData = entries[index];

                    this.credentialsList.push({
                        id: data.id,
                        environment: data.environment,
                        status: data.status,
                        data: data.data,
                        market: data.market,
                        createdAt: data.createdAt,
                    });
                }

                this.setLoading(false);
                this.ebayOAuth2AppComponent.isLoading = false;
            },
            error => {
                this.ebayOAuth2AppComponent.callStatusEvent(this.localization.translate('errorLoadCredentials') + ': ' + error.statusText, 'danger');
                this.ebayOAuth2AppComponent.isLoading = false;
                this.setLoading(false);
            }
        );

        this.ebayOAuth2AppComponent.isLoading = false;
    }

    private openAuthenticationPopup(environment:string = 'production')
    {
        this.setLoading(true);

        this.authenticationService.getLoginUrl(environment).subscribe(
            response => {

                var popup = window.open(
                    response.loginUrl,
                    'eBay Login',
                    'toolbar=no, location=#, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=600, height=600, top=0, left=50');

                var pollTimer = window.setInterval(() => {
                    if (popup.closed !== false)
                    {
                        window.clearInterval(pollTimer);

                        this.initCredentialsInfoboxes();

                        this.setLoading(false);
                    }
                }, 200);
            },
            error => {
                this.ebayOAuth2AppComponent.callStatusEvent(this.localization.translate('errorAuthentication') + ': ' + error.statusText, 'danger');
                this.ebayOAuth2AppComponent.isLoading = false;
                this.setLoading(false);
            }
        );
    }

    private saveCredentials(credentials:CredentialsData):void
    {
        this.setLoading(true);

        this.credentialService.save(credentials).subscribe(
            response => {
                // TODO: check success

                // this.toggleAccountInput();
            },
            error => {
                this.ebayOAuth2AppComponent.callStatusEvent(this.localization.translate('errorSaveCredentials') + ': ' + error.statusText, 'danger');
                this.ebayOAuth2AppComponent.isLoading = false;
                this.setLoading(false);
            }
        );
    }

    private refreshCredentialsToken(credentials:CredentialsData):void
    {
        this.openAuthenticationPopup(credentials.environment);
    }

    private removeCredentials(credentials:CredentialsData):void
    {
        this.setLoading(true);

        this.credentialService.remove(credentials.id).subscribe(
            response => {
                if(response['affectedRows'] > 0)
                {
                    this.initCredentialsInfoboxes();

                    this.ebayOAuth2AppComponent.callStatusEvent(this.localization.translate('successRemoveCredentials'), 'success');
                }
                else
                {
                    this.ebayOAuth2AppComponent.callStatusEvent(this.localization.translate('errorRemoveCredentials'), 'info');
                }

                this.setLoading(false);
            },
            error => {
                this.ebayOAuth2AppComponent.callStatusEvent(this.localization.translate('errorRemoveCredentials') + ': ' + error.statusText, 'danger');
                this.ebayOAuth2AppComponent.isLoading = false;
                this.setLoading(false);
            }
        );
    }

    // TODO
    private toggleAccountInput(test: any)
    {
        

        this.isAccountInputActive = !this.isAccountInputActive;
    }
}