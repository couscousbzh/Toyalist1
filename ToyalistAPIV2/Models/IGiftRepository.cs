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

        IEnumerable<Gift> GetByGiftListId(string id);

        Gift Get(string id);
        Gift Add(Gift item);
        void Remove(string id);
        bool Update(Gift item);
    }
}
