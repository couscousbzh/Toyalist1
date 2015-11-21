﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Runtime.Serialization;

namespace ToyalistAPI.Models
{
   
    public class Gift
    {
 
        public int Id { get; set; }
        public string Url { get; set; }
        public string Name { get; set; }
        public string Price { get; set; }
        public string Currency { get; set; }
        public string Description { get; set; }
        public string ImageURL { get; set; }

        public List<String> ImagesURL { get; set; }

    }
}
