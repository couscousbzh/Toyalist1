using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToyalistAPIV4.Models
{
    public interface IGiftListRepository
    {
        IEnumerable<GiftList> GetAll();
        IEnumerable<GiftList> GetAllGiftListsByUserId(string userId);
        GiftList Get(string id);
        GiftList Add(GiftList item);
        void Remove(GiftList item);
        bool Update(GiftList item);
    }
}
