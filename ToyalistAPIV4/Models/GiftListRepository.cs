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

        public void Remove(GiftList item)
        {
            try {
                //TODO : totalement ineficace, on load une liste de gift pour les effacer ensuite... ya pas mieux ?
                //j'ai tenté une authorisation de delete cascading dans le modelcreate du context, ca plante pour des raisons annexe à Asp.net Identity...
                //Bon en tout ca ca marche
                item.Gifts = _dbContext.Gifts.Select(x => x).Where(x => x.GiftListId == item.Id).ToList();

                //Manual Cascading delete
                _dbContext.Gifts.RemoveRange(item.Gifts);
                _dbContext.GiftLists.Remove(item);

                //_dbSet.Remove(item);

                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                throw ex;
            }

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
