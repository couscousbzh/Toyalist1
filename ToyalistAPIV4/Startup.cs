using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
//using ToyalistAPIV4.Providers;

[assembly: OwinStartup(typeof(ToyalistAPIV4.Startup))]
namespace ToyalistAPIV4
{
    public class Startup
    {



        //Ancienne methode pour démarrer OWIN seul, sans OAuth, sans CORS
        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration config = new HttpConfiguration();
            WebApiConfig.Register(config);
            app.UseWebApi(config);
        }

    }
}