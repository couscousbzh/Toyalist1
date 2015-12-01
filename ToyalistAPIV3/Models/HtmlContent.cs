using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Runtime.Serialization;

namespace ToyalistAPIV3.Models
{
   
    public class HtmlContent
    {
        public string urlcrawled { get; set; }

        public string title { get; set; }
        public string price { get; set; }
        public string currency { get; set; }
        public string description { get; set; }

        public string mainImageURL { get; set; }
        public List<string> imagesURL { get; set; }


        //public string ogtitle { get; set; }
        //public string ogdescription{ get; set; }
        //public string ogurl { get; set; }
        //public string ogimage { get; set; }

    }
}
