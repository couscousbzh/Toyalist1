using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToyalistAPIV4.Infrastructure;

namespace ToyalistAPIV4.Models
{
    public class GiftListRepository : IGiftListRepository
    {
        private List<GiftList> allGiftList = new List<GiftList>();

        internal ApplicationDbContext _dbContext;
        internal DbSet<GiftList> _dbSet;

        //Constuctor    
        public GiftListRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = dbContext.Set<GiftList>();
        }

        public IEnumerable<GiftList> GetAll()
        {
            return _dbSet.ToList();
        }

        public IEnumerable<GiftList> GetAllGiftListsByUserId(string userId)
        {
            return _dbSet.Select(p => p).Where(x => x.OwnerUserId == userId).ToList();
        }

        public GiftList Get(string id)
        {
            return _dbSet.Find(id);
        }

        public GiftList Add(GiftList item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            item.Id = Tools.GetRandomKey();
            _dbSet.Add(item);
            _dbContext.SaveChanges();

            return item;
        }

        public void Remove(string  id)
        {
            GiftList entityToDelete = _dbSet.Find(id);
            _dbSet.Remove(entityToDelete);
            _dbContext.SaveChanges();
        }

        public bool Update(GiftList item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("entityToUpdate");
            }

            _dbSet.Attach(item);
            _dbContext.Entry(item).State = EntityState.Modified;
            _dbContext.SaveChanges();

            return true;
        }
        
    }
}
