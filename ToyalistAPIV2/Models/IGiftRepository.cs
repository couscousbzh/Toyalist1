using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToyalistAPIV2.Models
{
    public interface IGiftRepository
    {
        IEnumerable<Gift> GetAll();
        //IEnumerable<GiftList> Get(string id);
        Gift Get(int id);
        Gift Add(Gift item);
        void Remove(int id);
        bool Update(Gift item);
    }
}
