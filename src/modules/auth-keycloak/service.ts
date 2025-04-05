import { AbstractAuthModuleProvider, MedusaError } from '@medusajs/framework/utils';
import { Logger } from '@medusajs/medusa';
import { AuthenticationInput, AuthIdentityProviderService, AuthenticationResponse } from '@medusajs/types';
import { OAuthService } from './oauth/oauth.service';
import { HttpClient } from './oauth/http-client';
import { OauthJwkService } from './oauth/oauth-jwk.service';
import { JwtUtil } from './oauth/jwt.util';
import { OauthOptions, OauthTokenResponse, OauthUserInfor } from './oauth/oauth.types';

type InjectedDependencies = {
	logger: Logger;
	jwtUtil: JwtUtil;
	httpClient: HttpClient;
	oauthService: OAuthService;
};

class OIDCAuthenticationService extends AbstractAuthModuleProvider {
	static identifier = 'keycloak';
	protected logger: Logger;
	protected jwtUtil: JwtUtil;
	protected httpClient: HttpClient;
	protected oauthService: OAuthService;

	constructor({ logger, jwtUtil, httpClient, oauthService }: InjectedDependencies, _options: any) {
		try {
			super();
			this.logger = logger;
			this.jwtUtil = jwtUtil;
			this.httpClient = httpClient;
			this.oauthService = oauthService;
		} catch (error) {
			logger.error(error);
		}

	}

	async authenticate(
		data: AuthenticationInput,
		authIdentityProviderService: AuthIdentityProviderService
	): Promise<AuthenticationResponse> {
		let isAuthenticated = false;
		let token = '';

		const bearerToken = data.headers?.authorization;
		if (bearerToken) {
			const tmp = bearerToken.split(' ');
			if (tmp.length > 1) {
				token = tmp[1];
				isAuthenticated = await this.oauthService.verify(token);
			}
		}

		// If user is not authenticated, return a callback URL
		if (!isAuthenticated)
			return {
				success: false,
				location: this.oauthService.createLoginUrl(),
			};

		const userProfile = this.jwtUtil.decode<OauthUserInfor>(token);
		let authIdentity;

		try {
			authIdentity = await authIdentityProviderService.retrieve({
				entity_id: userProfile.email,
			});
		} catch (error) {
			if (error.type === MedusaError.Types.NOT_FOUND) {
				authIdentity = await authIdentityProviderService.create({
					entity_id: userProfile.email, // email or some ID
				});
			}
		}

		return {
			success: true,
			authIdentity,
		};
	}

	async validateCallback(
		data: AuthenticationInput,
		authIdentityProviderService: AuthIdentityProviderService
	): Promise<AuthenticationResponse> {
		let code = data.query?.code;
		let tokenResponse: OauthTokenResponse;

		if (!code) return { success: false };

		try {
			tokenResponse = await this.oauthService.exchange(code);
		} catch (error) {
			return { success: false };
		}

		let authIdentity;
		let userProfile = this.jwtUtil.decode<OauthUserInfor>(tokenResponse.access_token);

		try {
			authIdentity = await authIdentityProviderService.retrieve({
				entity_id: userProfile.email, // email or some ID
			});
		} catch (e) {
			// The auth identity doesn't exist so create it
			authIdentity = await authIdentityProviderService.create({
				entity_id: userProfile.email, // email or some ID
				provider_metadata: {},
				user_metadata: {},
			});
		}

		return {
			success: true,
			authIdentity,
		};
	}
}

export default OIDCAuthenticationService;
