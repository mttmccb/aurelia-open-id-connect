var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "oidc-client", "./open-id-connect-roles", "./open-id-connect-configuration", "./open-id-connect-authorize-step", "./open-id-connect-logger", "./open-id-connect-navigation-strategies"], function (require, exports, aurelia_framework_1, oidc_client_1, open_id_connect_roles_1, open_id_connect_configuration_1, open_id_connect_authorize_step_1, open_id_connect_logger_1, open_id_connect_navigation_strategies_1) {
    "use strict";
    var OpenIdConnectRouting = (function () {
        function OpenIdConnectRouting(openIdConnectConfiguration, openIdConnectNavigationStrategies, logger, userManager) {
            this.openIdConnectConfiguration = openIdConnectConfiguration;
            this.openIdConnectNavigationStrategies = openIdConnectNavigationStrategies;
            this.logger = logger;
            this.userManager = userManager;
        }
        OpenIdConnectRouting.prototype.configureRouter = function (routerConfiguration) {
            this.addLoginRoute(routerConfiguration);
            this.addLogoutRoute(routerConfiguration);
            this.addLoginRedirectRoute(routerConfiguration);
            this.addLogoutRedirectRoute(routerConfiguration);
            routerConfiguration.addPipelineStep("authorize", open_id_connect_authorize_step_1.default);
        };
        OpenIdConnectRouting.prototype.addLoginRoute = function (routerConfiguration) {
            var _this = this;
            routerConfiguration.mapRoute({
                name: "login",
                nav: false,
                navigationStrategy: function (instruction) {
                    instruction.config.redirect = "";
                    return _this.openIdConnectNavigationStrategies.login(instruction);
                },
                route: "login",
                settings: {
                    roles: [
                        open_id_connect_roles_1.default.Anonymous,
                    ],
                },
            });
        };
        OpenIdConnectRouting.prototype.addLogoutRoute = function (routerConfiguration) {
            var _this = this;
            routerConfiguration.mapRoute({
                name: "logout",
                nav: false,
                navigationStrategy: function (instruction) {
                    instruction.config.redirect = "";
                    return _this.openIdConnectNavigationStrategies.logout(instruction);
                },
                route: "logout",
                settings: {
                    roles: [
                        open_id_connect_roles_1.default.Authorized,
                    ],
                },
            });
        };
        OpenIdConnectRouting.prototype.addLoginRedirectRoute = function (routerConfiguration) {
            var _this = this;
            routerConfiguration.mapRoute({
                name: "logInRedirectCallback",
                navigationStrategy: function (instruction) {
                    if (_this.isSilentLogin()) {
                        return _this.openIdConnectNavigationStrategies.silentSignICallback(instruction);
                    }
                    else {
                        return _this.openIdConnectNavigationStrategies.signInRedirectCallback(instruction);
                    }
                },
                route: this.getPath(this.openIdConnectConfiguration.userManagerSettings.redirect_uri),
            });
        };
        OpenIdConnectRouting.prototype.addLogoutRedirectRoute = function (routerConfiguration) {
            var _this = this;
            routerConfiguration.mapRoute({
                name: "logOutRedirectCallback",
                navigationStrategy: function (instruction) {
                    return _this.openIdConnectNavigationStrategies.signoutRedirectCallback(instruction);
                },
                route: this.getPath(this.openIdConnectConfiguration.userManagerSettings.post_logout_redirect_uri),
            });
        };
        OpenIdConnectRouting.prototype.isSilentLogin = function () {
            try {
                return window.self !== window.top;
            }
            catch (e) {
                return true;
            }
        };
        OpenIdConnectRouting.prototype.getPath = function (uri) {
            return this.convertUriToAnchor(uri).pathname;
        };
        ;
        OpenIdConnectRouting.prototype.convertUriToAnchor = function (uri) {
            var anchor = document.createElement("a");
            anchor.href = uri;
            return anchor;
        };
        return OpenIdConnectRouting;
    }());
    OpenIdConnectRouting = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [open_id_connect_configuration_1.default,
            open_id_connect_navigation_strategies_1.default,
            open_id_connect_logger_1.default,
            oidc_client_1.UserManager])
    ], OpenIdConnectRouting);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = OpenIdConnectRouting;
});
//# sourceMappingURL=open-id-connect-routing.js.map