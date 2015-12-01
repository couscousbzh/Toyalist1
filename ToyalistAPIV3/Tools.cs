using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Net;


namespace ToyalistAPIV3
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

        //Permet de généré une clé aléatoire, unsafe car potentiellement prévisible, mais utile pour éviter des conflits de clé
        public static string GetRandomKey()
        {
            Guid g = Guid.NewGuid();
            string guidString64 = Convert.ToBase64String(g.ToByteArray());
            guidString64 = guidString64.Replace("=", "");
            guidString64 = guidString64.Replace("+", "");
            guidString64 = guidString64.Replace("/", "");

            return guidString64; //exemple "OZVV5TpP4U6wJthaCORZEQ"
        }

        //Permet de généré une clé totalement aléatoire, sécurisée et non prévisible.
        public static string SecureRandomString(int length, string allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
        {
            if (length < 0) throw new ArgumentOutOfRangeException("length", "length cannot be less than zero.");
            if (string.IsNullOrEmpty(allowedChars)) throw new ArgumentException("allowedChars may not be empty.");

            const int byteSize = 0x100;
            var allowedCharSet = new HashSet<char>(allowedChars).ToArray();
            if (byteSize < allowedCharSet.Length) throw new ArgumentException(String.Format("allowedChars may contain no more than {0} characters.", byteSize));

            // Guid.NewGuid and System.Random are not particularly random. By using a
            // cryptographically-secure random number generator, the caller is always
            // protected, regardless of use.
            using (var rng = new System.Security.Cryptography.RNGCryptoServiceProvider())
            {
                var result = new StringBuilder();
                var buf = new byte[128];
                while (result.Length < length)
                {
                    rng.GetBytes(buf);
                    for (var i = 0; i < buf.Length && result.Length < length; ++i)
                    {
                        // Divide the byte into allowedCharSet-sized groups. If the
                        // random value falls into the last group and the last group is
                        // too small to choose from the entire allowedCharSet, ignore
                        // the value in order to avoid biasing the result.
                        var outOfRangeStart = byteSize - (byteSize % allowedCharSet.Length);
                        if (outOfRangeStart <= buf[i]) continue;
                        result.Append(allowedCharSet[buf[i] % allowedCharSet.Length]);
                    }
                }
                return result.ToString();
            }
        }


    }
}
