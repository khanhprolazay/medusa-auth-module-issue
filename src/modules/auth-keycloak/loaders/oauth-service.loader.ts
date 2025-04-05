import { ModuleProviderLoaderFunction } from '@medusajs/framework/types';
import { OauthOptions } from '../oauth/oauth.types';
import { SERVICES } from '../../../constants';
import { OauthJwkService } from '../oauth/oauth-jwk.service';
import { JwtUtil } from '../oauth/jwt.util';
import { HttpClient } from '../oauth/http-client';
import { asValue } from 'awilix';
import { Logger } from '@medusajs/medusa';

const oauthServiceLoader: ModuleProviderLoaderFunction = async ({ container, options }, _) => {
	const requiredKeys = ['openidConfigurationUrl', 'clientId', 'clientSecret', 'redirectUri'];

	if (!options) 
		throw new Error("Provided data is invalid")

	if (requiredKeys.some(key => !options[key]))
		throw new Error("Provided data is invalid")

	const logger = container.resolve<Logger>(SERVICES.LOGGER);
	logger.info('Initializing oauth service...');

	try {
		const jwtUtil = new JwtUtil();
		const httpClient = new HttpClient();

		if (!options) {
			throw new Error('Cannot load oauth service');
		}
		const oauthJwkService = new OauthJwkService(options as OauthOptions, jwtUtil, httpClient);

		container.register(SERVICES.OAUTH, asValue(oauthJwkService));
		container.register(SERVICES.JWT_UTIL, asValue(jwtUtil));
		container.register(SERVICES.HTTP_CLIENT, asValue(httpClient));
	} catch (error) {
		throw new Error(error);
	}
	logger.info('Oauth service initialized...');
};

export default oauthServiceLoader;
