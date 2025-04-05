import oauthServiceLoader from "./loaders/oauth-service.loader"
import OIDCAuthenticationService from "./service"
import { 
  ModuleProvider, 
  Modules
} from "@medusajs/framework/utils"

export default ModuleProvider(Modules.AUTH, {
  services: [OIDCAuthenticationService],
  loaders: [oauthServiceLoader],  
})