using Microsoft.Owin.Security.DataHandler.Encoder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Web.Http;

namespace ToyalistAPIV4.Controllers
{
    [RoutePrefix("api/helper")]
    public class HelperController : BaseApiController
    {
        [Authorize(Roles = "Admin")]
        [Route("getsecret")]
        [HttpGet]
        public IHttpActionResult GetSecret([FromUri]string clientName)
        {
            var clientId = Guid.NewGuid().ToString("N");

            var key = new byte[32];
            RNGCryptoServiceProvider.Create().GetBytes(key);
            var base64Secret = TextEncodings.Base64Url.Encode(key);

            return Ok(base64Secret);
        }
    }
}
