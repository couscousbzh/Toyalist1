using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToyalistAPIV4.Models
{
    public class GiftRepository : IGiftRepository
    {
        private List<Gift> gifts = new List<Gift>();

        //Constuctor    
        public GiftRepository()
        {           
        }

        public IEnumerable<Gift> GetAll()
        {
            return gifts;
        }

        public IEnumerable<Gift> GetByGiftListId(string id)
        {
            return gifts.Select(p => p).Where(x => x.GiftListId == id).ToList();
        }
        
        public Gift Get(string id)
        {
            return gifts.Find(p => p.Id == id);
        }

        public Gift Add(Gift item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            
            item.Id = Tools.GetRandomKey();
            gifts.Add(item);
            return item;
        }

        public void Remove(string id)
        {
            gifts.RemoveAll(p => p.Id == id);
        }

        public bool Update(Gift item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            int index = gifts.FindIndex(p => p.Id == item.Id);
            if (index == -1)
            {
                return false;
            }
            gifts.RemoveAt(index);
            gifts.Add(item);
            return true;
        }
    }
}
