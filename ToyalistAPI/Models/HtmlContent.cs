using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Runtime.Serialization;

namespace ToyalistAPI.Models
{
   
    public class HtmlContent
    {
 
        public string title { get; set; }
        public double price { get; set; }
        public string description { get; set; }
       
        public List<string> imagesURL { get; set; }


        public string ogtitle { get; set; }
        public string ogdescription{ get; set; }
        public string ogurl { get; set; }
        public string ogimage { get; set; }

    }
}
