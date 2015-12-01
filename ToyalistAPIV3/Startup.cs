using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using ToyalistAPIV3.Providers;

[assembly: OwinStartup(typeof(ToyalistAPIV3.Startup))]
namespace ToyalistAPIV3
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration config = new HttpConfiguration();

            ConfigureOAuth(app);

            WebApiConfig.Register(config);
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll); //Valide CORS pour Web API 2, pas OWNIN
            app.UseWebApi(config);
        }

        public void ConfigureOAuth(IAppBuilder app)
        {
            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                Provider = new SimpleAuthorizationServerProvider()
            };

            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions()); //Cors est validé dans le provider pour OWIN

        }


        //Ancienne methode pour démarrer OWIN seul, sans OAuth, sans CORS
        //public void Configuration(IAppBuilder app)
        //{
        //    HttpConfiguration config = new HttpConfiguration();
        //    WebApiConfig.Register(config);
        //    app.UseWebApi(config);
        //}

    }
}