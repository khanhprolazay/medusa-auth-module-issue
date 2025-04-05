import { OAuthService } from './oauth.service';
import { OauthOptions } from './oauth.types';
import { HttpClient } from './http-client';
import { OAUTH_OPTIONS } from './oauth.constant';

export class OauthIntrospectService extends OAuthService {
	constructor(protected options: OauthOptions, protected httpClient: HttpClient) {
		super(options, httpClient);
	}

	protected override async initializeConfiguration(): Promise<void> {
		await super.initializeConfiguration();
		if (!this.configuration.introspection_endpoint) {
			throw new Error('Introspection endpoint is not defined.');
		}
	}

	async verify(token: string): Promise<boolean> {
		// Verify token by calling introspection endpoint
		const response = await this.httpClient.post<{ active: boolean }>(
			this.configuration.introspection_endpoint as string,
			{
				token,
				client_id: this.options.clientId,
				client_secret: this.options.clientSecret,
			}
		);
		return response.data.active;
	}
}
