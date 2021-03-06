﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToyalistAPIV1.Models
{
    public interface IGiftRepository
    {
        IEnumerable<Gift> GetAll();
        Gift Get(int id);
        Gift Add(Gift item);
        void Remove(int id);
        bool Update(Gift item);
    }
}
