import { loadEnv, defineConfig, Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils';

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

const OAuth2ClientId = process.env.OAUTH2_CLIENT_ID || '';
const OAuth2ClientSecret = process.env.OAUTH2_CLIENT_SECRET || '';

const OpenIdConfigurationURL = process.env.OAUTH_OPENID_CONFIGURATION_URL || '';
const OauthRedirectUri  = process.env.OAUTH_REDIRECT_URI || '';
const OauthPostLogoutRedirectUri = process.env.OAUTH_POST_LOGOUT_REDIRECT_URI || '';

module.exports = defineConfig({
	projectConfig: {
		databaseUrl: process.env.DATABASE_URL,
		http: {
			storeCors: process.env.STORE_CORS!,
			adminCors: process.env.ADMIN_CORS!,
			authCors: process.env.AUTH_CORS!,
			jwtSecret: process.env.JWT_SECRET || 'supersecret',
			cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
			// authMethodsPerActor: {
			// 	user: ['keycloak'],
			// 	customer: ['keycloak']
			// }
		},
	},
	modules: [
		{
			resolve: '@medusajs/medusa/auth',
			options: {
				providers: [
					// default provider
					{
						resolve: "@medusajs/medusa/auth-emailpass",
						dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
						id: "emailpass",
					},			
					{
						// if module provider is in a plugin, use `plugin-name/providers/my-auth`
						resolve: './src/modules/auth-keycloak',
						id: 'keycloak',
						dependencies: [ContainerRegistrationKeys.LOGGER],
						options: {
							openidConfigurationUrl: OpenIdConfigurationURL,
							clientId: OAuth2ClientId,
							clientSecret: OAuth2ClientSecret,
							redirectUri: OauthRedirectUri,
							postLogoutRedirectUri: OauthPostLogoutRedirectUri,
						},
					},
				],
			},
		},
	],
});
