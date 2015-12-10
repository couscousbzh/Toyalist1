using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToyalistAPIV4.Infrastructure;

namespace ToyalistAPIV4.Models
{
    public class GiftRepository : IGiftRepository
    {
        internal ApplicationDbContext _dbContext;
        internal DbSet<Gift> _dbSet;

        //Constuctor    
        public GiftRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = dbContext.Set<Gift>();
        }

        public IEnumerable<Gift> GetAll()
        {
            return _dbSet.ToList();
        }
        
        public IEnumerable<Gift> GetAllGiftListsByUserId(string userId)
        {
            return _dbSet.Select(p => p).Where(x => x.OwnerUserId == userId).ToList();
        }
        
        public IEnumerable<Gift> GetByGiftListId(string id)
        {
            return _dbSet.Select(p => p).Where(x => x.GiftListId == id).ToList();
        }
        
        public Gift Get(string id)
        {
            return _dbSet.Find(id);
        }

        public Gift Add(Gift item)
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

        public void Remove(Gift item)
        {
            try
            {              
                _dbSet.Remove(item);
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool Update(Gift item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("entityToUpdate");
            }

            _dbContext.Gifts.Attach(item);
            _dbContext.Entry(item).State = EntityState.Modified;
            _dbContext.SaveChanges();

            return true;
        }
    }
}
