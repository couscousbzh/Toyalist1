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
//using System.Web.Http.Cors;
using System.Web;
using System.Configuration;

using ToyalistAPIV4.Models;
using System.Text.RegularExpressions;
using System.Net.Http.Headers;

namespace ToyalistAPIV4.Controllers
{
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CrawlerController : ApiController
    {

        [HttpGet]
        public HttpResponseMessage Get([FromUri] string url)
        {
            try
            {
                Uri uri = new Uri(url);

                #region Requete Get HTML
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(uri);
                request.Method = WebRequestMethods.Http.Get;
                request.Headers.Add("Content-Encoding", "utf-8");

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();

                StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);

                String responseString = reader.ReadToEnd();

                response.Close();

                #endregion

                #region HTML Parsing using HTMLAgilityPack


                String title = "";
                String desc = "";
                String mainImageUrl = "";
                String price = "";
                String currency = "";
                String ogtitle = "";
                String ogdescription = "";
                String ogimage = "";
                String ogurl = "";
                List<String> imgs = new List<string>();
                String itemprop_price = "";
                String itemprop_pricecurrency = "";


                HtmlDocument doc = new HtmlDocument();
                doc.LoadHtml(responseString);


                title = (from x in doc.DocumentNode.Descendants()
                                where x.Name.ToLower() == "title"
                                select x.InnerText).FirstOrDefault();

                desc = (from x in doc.DocumentNode.Descendants()
                               where x.Name.ToLower() == "meta"
                               && x.Attributes["name"] != null
                               && x.Attributes["name"].Value.ToLower() == "description"
                               select x.Attributes["content"].Value).FirstOrDefault();


                ogtitle = (from x in doc.DocumentNode.Descendants()
                                  where x.Name.ToLower() == "meta"
                                  && x.Attributes["property"] != null
                                  && x.Attributes["property"].Value.ToLower() == "og:title"
                                  select x.Attributes["content"].Value).FirstOrDefault();

                ogdescription = (from x in doc.DocumentNode.Descendants()
                                        where x.Name.ToLower() == "meta"
                                        && x.Attributes["property"] != null
                                        && x.Attributes["property"].Value.ToLower() == "og:description"
                                        select x.Attributes["content"].Value).FirstOrDefault();


                ogimage = (from x in doc.DocumentNode.Descendants()
                                  where x.Name.ToLower() == "meta"
                                  && x.Attributes["property"] != null
                                  && x.Attributes["property"].Value.ToLower() == "og:image"
                                  select x.Attributes["content"].Value).FirstOrDefault();

                ogurl = (from x in doc.DocumentNode.Descendants()
                                where x.Name.ToLower() == "meta"
                                && x.Attributes["property"] != null
                                && x.Attributes["property"].Value.ToLower() == "og:url"
                                select x.Attributes["content"].Value).FirstOrDefault();

                try {
                    imgs = (from x in doc.DocumentNode.Descendants()
                            where x.Name.ToLower() == "img"
                            select x.Attributes["src"].Value).ToList<String>();
                }
                catch { }//Plante sur priceminister, va savoir pourquoi.
                

                /* Standard Google itemprop "price" SEO */
                itemprop_price = (from x in doc.DocumentNode.Descendants()
                                where x.Name.ToLower() == "meta"
                                && x.Attributes["itemprop"] != null
                                && x.Attributes["itemprop"].Value.ToLower() == "price"
                                         select x.Attributes["content"].Value).FirstOrDefault();

                /* Standard Google itemprop "priceCurrency" SEO */
                itemprop_pricecurrency = (from x in doc.DocumentNode.Descendants()
                                         where x.Name.ToLower() == "meta"
                                         && x.Attributes["itemprop"] != null
                                         && x.Attributes["itemprop"].Value.ToLower() == "pricecurrency"
                                         select x.Attributes["content"].Value).FirstOrDefault();

                #endregion


                /*********************************/
                /* Clean and prepare data */

                #region Image list Work
                //Ajoute le domaine au path de chaque image si besoin et evite d'avoir deux '//', si l'url est relative
                for (int i = 0; i < imgs.Count; i++) {
                    if (!imgs[i].StartsWith("http"))
                        imgs[i] = uri.AbsoluteUri + imgs[i].TrimStart('/');                    
                }
                
                //Vire les doublons (important pour ng-repeat angular qui n'aime pas trop)
                imgs = imgs.Distinct().ToList();

                //Vire les url qui ne comporte pas d'extension image : .png, .jpg, .jpeg, .gif, .svg
                //imgs = (from x in imgs
                //        where x.Contains(".jpg") || x.Contains(".jpeg") || x.Contains(".png") || x.Contains(".gif") || x.Contains(".svg")
                //        select x).ToList();

                //Filtre et classe les images par son poids en octet
                long minimumImageSize = long.Parse(ConfigurationManager.AppSettings["minimumImageSize"]);
                Dictionary<String, long> imgsDicFiltered = new Dictionary<string, long>();
                foreach (string img in imgs)
                {
                    long fileSize;

                    try
                    {
                        fileSize = Tools.GetImageSize(img);

                        if (fileSize > minimumImageSize)
                            imgsDicFiltered.Add(img, fileSize);
                    }
                    catch {
                        //Dans l'éventualité ou le crawler n'a pas accès à la ressource image (403), filtre distant, IP ou raison inconnue... 
                        
                        //imgsDicFiltered.Add(img, 0);
                    }
                }
                //Classe la liste des images par ordre de poids, de la plus grosse a la plus petite
                List<KeyValuePair<string, long>> myList = imgsDicFiltered.ToList();
                myList.Sort((x, y) => y.Value.CompareTo(x.Value));
                imgs = myList.Select(x => x.Key).ToList();

                //Selectionne seulement les 5 premiers
                imgs = imgs.Take(5).ToList();

                #endregion

                #region Main Image list

                //Par defaut l'image principale sera celle indiqué par les tags Facebook. Sinon on prends la premiere de la liste ci dessus. Sinon on a une image par défaut.

                //PATCH www.rueducommerce.fr
                // --> l'image og:image meta facebook n'est pas bonne. 
                if (url.ToLower().Contains("www.rueducommerce.fr"))
                    ogimage = "";

                if (!String.IsNullOrEmpty(ogimage))
                    mainImageUrl = ogimage;
                else
                {
                    if (imgs.Count > 0)
                        mainImageUrl = imgs[0];
                    else
                        mainImageUrl = "http://toyalist.reactor.fr/images/no-thumb.png";
                }
                
                #endregion
                
                #region Price search

                /* Patch Rue du commerce*/
                if (url.ToLower().Contains("www.rueducommerce.fr")) { 
                   
                    itemprop_price = (from x in doc.DocumentNode.Descendants()
                                        where x.Attributes["itemprop"] != null
                                        && x.Attributes["itemprop"].Value.ToLower() == "price"
                                        select x.InnerHtml).FirstOrDefault();
                }


                /* Patch Rue du commerce*/
                if (url.ToLower().Contains("fnac.com"))
                {
                    itemprop_price = (from x in doc.DocumentNode.Descendants()
                                        where x.Name.ToLower() == "meta"
                                        && x.Attributes["itemprop"] != null
                                        && x.Attributes["itemprop"].Value.ToLower() == "lowprice"
                                      select x.Attributes["content"].Value).FirstOrDefault();

                    //Fnac returns value like this --> 35&nbsp;&euro;
                    //We apply a regex to get only numbers
                    itemprop_price = Regex.Match(itemprop_price, @"\d+").Value;
                }


                if (!String.IsNullOrEmpty(itemprop_price))
                    price = itemprop_price;
                else
                    price = "?";

                #endregion

                #region Currency               
                if (!String.IsNullOrEmpty(itemprop_pricecurrency))
                    currency = itemprop_pricecurrency;
                else
                    currency = "€";
                #endregion


                /*************************************/

                //decode les éventuels caractère encodé en html
                title = HttpUtility.HtmlDecode(title).TrimStart().TrimEnd();
                desc = HttpUtility.HtmlDecode(desc);
                ogtitle = HttpUtility.HtmlDecode(ogtitle);
                ogdescription = HttpUtility.HtmlDecode(ogdescription);
                ogimage = HttpUtility.HtmlDecode(ogimage);
                ogurl = HttpUtility.HtmlDecode(ogurl);
                price = HttpUtility.HtmlDecode(price);
                currency = HttpUtility.HtmlDecode(currency);

                /*********************************/
                /* Compose response */

                HtmlContent htmlContent = new HtmlContent();
                htmlContent.urlcrawled = url;
                if (!String.IsNullOrEmpty(ogtitle))
                    htmlContent.title = ogtitle;
                else
                    htmlContent.title = title;
                if (!String.IsNullOrEmpty(ogdescription))
                    htmlContent.description = ogdescription;
                else
                    htmlContent.description = desc;
                htmlContent.description = desc;
                htmlContent.imagesURL = imgs;
                //htmlContent.ogtitle = ogtitle;
                //htmlContent.ogdescription = ogdescription;
                //htmlContent.ogurl = ogurl;
                //htmlContent.ogimage = ogimage;
                htmlContent.price = price;
                htmlContent.currency = currency;
                htmlContent.mainImageURL = mainImageUrl;



                /*********************************/
                /* Send response */
                string json = JsonConvert.SerializeObject(htmlContent);
                return new HttpResponseMessage()  { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
                //return Ok(cleanJson);


                /*END*/
            }
            catch (Exception ex)
            {
                //return BadRequest(ex.Message);
                string errorMsg = ex.Message.Replace("'","").Replace(":", "").Replace("\"", "");
                string jsonError = "{ \"message\" : \"" + errorMsg + "\" , \"urlcrawled\" : \"" + url + "\" }";

                HttpResponseMessage httpResponseMessage = new HttpResponseMessage(HttpStatusCode.BadRequest);
                httpResponseMessage.Content = new StringContent(jsonError);
                httpResponseMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                return httpResponseMessage;
            }


        }




     
    }
}
