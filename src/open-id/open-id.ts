import { autoinject, FrameworkConfiguration } from "aurelia-framework";
import { RouterConfiguration } from "aurelia-router";
import { User, UserManager, UserManagerSettings } from "oidc-client";
import { OpenIdRouterConfigurationService } from "./open-id-router-configuration-service";
import { OpenIdConfiguration } from "./open-id-configuration";
import { OpenIdLogger } from "./open-id-logger";

function configure(config: FrameworkConfiguration, callback: Function) {

    let logger: OpenIdLogger = config.container.get(OpenIdLogger);
    
    // config.globalResources('./foo');

    callback(function (oidcConfig: OpenIdConfiguration) {
        logger.Debug("Configuring the OpenId Connect Client");

        let userManagerSettings = oidcConfig.UserManagerSettings;
        config.container.registerInstance(UserManager, new UserManager(userManagerSettings));
        config.container.registerInstance(OpenIdConfiguration, oidcConfig);
    });
}

@autoinject
class OpenId {

    constructor(
        private routerConfigurationService: OpenIdRouterConfigurationService,
        private logger: OpenIdLogger,
        public UserManager: UserManager) { }

    public Configure(routerConfiguration: RouterConfiguration) {

        // TODO throw if routerConfiguration is null
        // TODO throw is openIdConfiguration is null (maybe - do we have defaults?)
        this.routerConfigurationService.ConfigureRouter(
            routerConfiguration,
            this.LoginRedirectHandler,
            this.PostLogoutRedirectHandler);
    }

    public Login() {
        this.logger.Debug("Login");

        // prevent Error: No matching state found in storage, 
        // possibly from duplicate state entries
        let stateStore: any = null;
        this.UserManager.clearStaleState(stateStore).then(() => {
            let args: any = {};
            this.UserManager.signinRedirect(args);
        });
    }

    public Logout() {
        this.logger.Debug("Logout");

        // signoutRedirect throws with empty/null data.
        this.UserManager.signoutRedirect({});
    }

    // This is public only to facilitate unit testing.
    // And is a lamda to capture the object in `this`.
    public LoginRedirectHandler = (): Promise<any> => {
        this.logger.Debug("LoginRedirectHandler");
        return this.UserManager.getUser().then((user) => {
            // avoid page refresh errors
            if (user === null || user === undefined) {
                this.logger.Debug(`user: ${user}`);
                this.logger.Debug(`window.location.href: ${window.location.href}`);
                return this.UserManager.signinRedirectCallback(null);
            }
        });
    }

    // This is public only to facilitate unit testing.
    // And is a lamda to capture the object in `this`.
    public PostLogoutRedirectHandler = (): Promise<any> => {
        this.logger.Debug("PostLogoutRedirectHandler");
        return this.UserManager.signoutRedirectCallback(null);
    }
}

export {
    configure,
    OpenId,
    OpenIdConfiguration,
    OpenIdLogger,
    OpenIdRouterConfigurationService,
    User,
    UserManager,
    UserManagerSettings
}