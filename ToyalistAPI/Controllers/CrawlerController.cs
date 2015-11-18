using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using HtmlAgilityPack;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Web.Http.Cors;
using System.Web;

using ToyalistAPI.Models;
using System.Text.RegularExpressions;

namespace ToyalistAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CrawlerController : ApiController
    {

        [HttpGet]
        public HttpResponseMessage Get([FromUri] string url)
        {
            try
            {
                Uri uri = new Uri(url);

                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(uri);
                request.Method = WebRequestMethods.Http.Get;
                //request.ContentType = "application/x-www-form-urlencoded;";
                request.Headers.Add("Content-Encoding", "utf-8");

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();

                StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);

                String responseString = reader.ReadToEnd();

                response.Close();

                HtmlDocument doc = new HtmlDocument();
                doc.LoadHtml(responseString);

                String title = (from x in doc.DocumentNode.Descendants()
                                where x.Name.ToLower() == "title"
                                select x.InnerText).FirstOrDefault();

                String desc = (from x in doc.DocumentNode.Descendants()
                               where x.Name.ToLower() == "meta"
                               && x.Attributes["name"] != null
                               && x.Attributes["name"].Value.ToLower() == "description"
                               select x.Attributes["content"].Value).FirstOrDefault();


                String ogtitle = (from x in doc.DocumentNode.Descendants()
                                  where x.Name.ToLower() == "meta"
                                  && x.Attributes["property"] != null
                                  && x.Attributes["property"].Value.ToLower() == "og:title"
                                  select x.Attributes["content"].Value).FirstOrDefault();

                String ogdescription = (from x in doc.DocumentNode.Descendants()
                                        where x.Name.ToLower() == "meta"
                                        && x.Attributes["property"] != null
                                        && x.Attributes["property"].Value.ToLower() == "og:description"
                                        select x.Attributes["content"].Value).FirstOrDefault();


                String ogimage = (from x in doc.DocumentNode.Descendants()
                                  where x.Name.ToLower() == "meta"
                                  && x.Attributes["property"] != null
                                  && x.Attributes["property"].Value.ToLower() == "og:image"
                                  select x.Attributes["content"].Value).FirstOrDefault();

                String ogurl = (from x in doc.DocumentNode.Descendants()
                                where x.Name.ToLower() == "meta"
                                && x.Attributes["property"] != null
                                && x.Attributes["property"].Value.ToLower() == "og:url"
                                select x.Attributes["content"].Value).FirstOrDefault();


                List<String> imgs = (from x in doc.DocumentNode.Descendants()
                                     where x.Name.ToLower() == "img"
                                     select x.Attributes["src"].Value).ToList<String>();


                /*********************************/
                /* Clean and prepare data */
                //Ajoute le domaine au path de chaque image et evite d'avoir deux '//', si l'url est relative
                //imgs = imgs.Select(x => uri.AbsoluteUri + x.TrimStart('/')).ToList();
                for (int i = 0; i < imgs.Count; i++) {

                    if (imgs[i].StartsWith("http"))
                    {
                        //fait rien
                    }
                    else
                    {
                        imgs[i] = uri.AbsoluteUri + imgs[i].TrimStart('/');
                    }
                }
                
                //Vire les doublons (important pour ng-repeat angular qui n'aime pas trop)
                imgs = imgs.Distinct().ToList();

                //Vire les url qui ne comporte pas d'extension image : .png, .jpg, .jpeg, .gif, .svg
                imgs = (from x in imgs
                        where x.Contains(".jpg") || x.Contains(".jpeg") || x.Contains(".png") || x.Contains(".gif") || x.Contains(".svg")
                        select x).ToList();


                //decode les éventuels caractère encodé en html
                title = HttpUtility.HtmlDecode(title).TrimStart().TrimEnd();
                desc = HttpUtility.HtmlDecode(desc);
                ogtitle = HttpUtility.HtmlDecode(ogtitle);
                ogdescription = HttpUtility.HtmlDecode(ogdescription);
                ogimage = HttpUtility.HtmlDecode(ogimage);
                ogurl = HttpUtility.HtmlDecode(ogurl);

                /*********************************/

                HtmlContent htmlContent = new HtmlContent();
                htmlContent.title = title;
                htmlContent.description = desc;
                htmlContent.imagesURL = imgs;
                htmlContent.ogtitle = ogtitle;
                htmlContent.ogdescription = ogdescription;
                htmlContent.ogurl = ogurl;
                htmlContent.ogimage = ogimage;

                string json = JsonConvert.SerializeObject(htmlContent);

                //StringContent cleanJson = new StringContent(json, System.Text.Encoding.UTF8, "application/json"); //Enleve les backslash dans le contenu de la réponse string
                
                return new HttpResponseMessage()
                {
                    Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json")
                };

                //return Ok(cleanJson);
            }
            catch (Exception ex)
            {
                //return BadRequest(ex.Message);
                string jsonError = "{ 'error' : '" + ex.Message + "'}";
                return new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent(ex.Message)
                };
            }


        }




     
    }
}
