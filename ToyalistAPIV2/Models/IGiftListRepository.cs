using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToyalistAPIV2.Models
{
    public interface IGiftListRepository
    {
        IEnumerable<GiftList> GetAll();
        GiftList Get(string sid);
        GiftList Add(GiftList item);
        void Remove(string sid);
        bool Update(GiftList item);
    }
}
