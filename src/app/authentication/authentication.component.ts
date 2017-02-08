import {Component, OnInit, forwardRef, Inject} from '@angular/core';
import { Locale } from 'angular2localization/angular2localization';
import { LocaleService} from 'angular2localization/angular2localization';
import { LocalizationService} from 'angular2localization/angular2localization';
import { TerraSelectBoxValueInterface } from '@plentymarkets/terra-components/index';
import { CredentialsData } from './data/credentials-data';
import { CredentialsService } from './service/credentials.service';
import { AuthenticationService } from './service/authentication.service';
import {EbayAuthenticationComponent} from "../ebay-authentication.component";

@Component({
    selector: 'authentication',
    template: require('./authentication.component.html'),
    styles: [require('./authentication.component.scss').toString()]
})

export class AuthenticationComponent extends Locale implements OnInit
{
    private isLoading:boolean = true;
    private environment:string;
    private environmentValues:Array<TerraSelectBoxValueInterface>;
    private credentialList:Array<CredentialsData>;

    constructor(
        private credentialService:CredentialsService,
        private authenticationService:AuthenticationService,
        @Inject(forwardRef(() => EbayAuthenticationComponent)) private ebayAuthenticationComponent:EbayAuthenticationComponent,
        locale:LocaleService,
        localization:LocalizationService
    )
    {
        super(locale,localization);


        this.environment = 'production';
        this.environmentValues = [
            {
                value: 'production',
                caption: 'Production'
            },
            {
                value: 'sandbox',
                caption: 'Sandbox'
            }
        ];

        this.initCredentialTable();
    }

    ngOnInit(): void
    {
        this.setLoading(false);
    }

    private initCredentialTable()
    {
        this.setLoading(true);

        this.credentialService.search().subscribe(
            response => {
                this.credentialList = [];

                let entries = response['entries'];

                for (let index in entries) {
                    let data:CredentialsData = entries[index];

                    this.credentialList.push({
                        id: data.id,
                        environment: data.environment,
                        status: data.status,
                        data: data.data,
                        market: data.market,
                    });
                }

                this.setLoading(false);
                this.ebayAuthenticationComponent.isLoading = false;
            },
            error => {
                this.ebayAuthenticationComponent.callStatusEvent(this.localization.translate('errorLoadCredentials') + ': ' + error.statusText, 'danger');
                this.ebayAuthenticationComponent.isLoading = false;
                this.setLoading(false);
            }
        );
    }

    private openAuthenticationPopup()
    {
        this.setLoading(true);

        this.authenticationService.getLoginUrl(this.environment).subscribe(
            response => {
                this.setLoading(false);

                var popup = window.open(
                    response.loginUrl,
                    'eBay Login',
                    'toolbar=no, location=#, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=600, height=600, top=0, left=50');

                var pollTimer = window.setInterval(() => {
                    if (popup.closed !== false) {
                        window.clearInterval(pollTimer);

                        this.reload();
                    }
                }, 200);
            },
            error => {
                this.ebayAuthenticationComponent.callStatusEvent(this.localization.translate('errorAuthentication') + ': ' + error.statusText, 'danger');
                this.ebayAuthenticationComponent.isLoading = false;
                this.setLoading(false);
            }
        );
    }

    private refreshToken(item:CredentialsData):void
    {
        this.setLoading(true);

        this.authenticationService.refreshToken(item.id).subscribe(
            response => {
                this.setLoading(false);

                item.data.expiration = <CredentialsData> response.data.refreshTokenExpiration;

                this.ebayAuthenticationComponent.callStatusEvent(this.localization.translate('successRefreshToken'), 'success');
            },
            error => {
                this.ebayAuthenticationComponent.callStatusEvent(this.localization.translate('errorRefreshToken') + ': ' + error.statusText, 'danger');
                this.ebayAuthenticationComponent.isLoading = false;
                this.setLoading(false);
            }
        );
    }

    private deleteCredential(item:CredentialsData):void
    {
        this.setLoading(true);

        this.credentialService.deleteCredential(item.id).subscribe(
            response => {
                this.setLoading(false);

                if(response['affectedRows'] > 0)
                {
                    let index = this.credentialList.indexOf(item);
                    this.credentialList.splice(index, 1);

                    this.ebayAuthenticationComponent.callStatusEvent(this.localization.translate('successDeleteCredentials'), 'success');
                }
                else
                {
                    this.ebayAuthenticationComponent.callStatusEvent(this.localization.translate('errorDeleteCredentials'), 'info');
                }
            },
            error => {
                this.ebayAuthenticationComponent.callStatusEvent(this.localization.translate('errorDeleteCredentials') + ': ' + error.statusText, 'danger');
                this.ebayAuthenticationComponent.isLoading = false;
                this.setLoading(false);
            }
        );
    }

    private setLoading(isLoading:boolean)
    {
        this.ebayAuthenticationComponent.callLoadingEvent(isLoading);
        this.isLoading = isLoading;
    }

    private reload()
    {
        location.reload();
    }
}