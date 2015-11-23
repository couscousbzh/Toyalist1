using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Runtime.Serialization;

namespace ToyalistAPIV2.Models
{
   
    public class GiftList
    { 
        public int Id { get; set; }
        public string Name { get; set; }
        public string TotalPrice { get; set; }
        
        public List<Gift> Gifts { get; set; }

    }
}
