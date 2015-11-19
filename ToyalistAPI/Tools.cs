using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Net;


namespace ToyalistAPI
{
    public class Tools
    {
        public static long GetImageSize(string url)
        {
            try
            {
                HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(url);
                req.Method = "HEAD";
                req.UserAgent = "Mozilla / 5.0(Windows NT 10.0; WOW64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 46.0.2490.86 Safari / 537.36";

                //Question :  est il nécessaire de changer ce user agent dans le temps ? random ?

                System.Net.WebResponse resp = req.GetResponse();
                long contentLength = 0;

                if (long.TryParse(resp.Headers.Get("Content-Length"), out contentLength))
                {      
                    return contentLength;
                }

                return contentLength;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        } 

    }
}
