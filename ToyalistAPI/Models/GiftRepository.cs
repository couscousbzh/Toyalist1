using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToyalistAPI.Models
{
    public class GiftRepository : IGiftRepository
    {
        private List<Gift> gifts = new List<Gift>();
        private int _nextId = 1;

        //int secondeCacheMemory = 600; //10 min = 600
        //MemoryCacher memCacher = new MemoryCacher();

        //private static List<Gift> dataCachedList = new List<Gift>();

        //private void RefreshData()
        //{
        //    if ((List<Gift>)memCacher.GetValue("GiftToken1") == null)
        //    {
        //        ////Récuperation depuis la BD 
        //        //using (var db = new TrackusContext())
        //        //{
        //        //    //dataList = db.Trackus.ToList();

        //        //    dataList = db.Tracks.OrderByDescending(p => p.SpotedTime).ToList();
        //        //}

        //        //First load

        //        dataCachedList = giftListBidon;
        //        //Mise ne cache
        //        memCacher.Add("GiftToken1", dataCachedList, DateTimeOffset.UtcNow.AddSeconds(secondeCacheMemory));
        //    }
        //    else
        //    {
        //        //récupere depuis le cache les données
        //        List<Gift> giftListFromCache = (List<Gift>)memCacher.GetValue("GiftToken1");
        //        dataCachedList = giftListFromCache;
        //    }
        //}


        //Constuctor    
        public GiftRepository()
        {
            gifts = new List<Gift>
            {
                new Gift {
                    Id = 1,
                    Url = "http://www.auchan.fr/mattel-barbie-robe-de-mariee/p-c377746",
            Name = "Poupée",
                    Price = "13",
                    Currency =  "$",
                    Description =  "Fusce vitae sodales nunc. Nullam vehicula nulla sed ligula sodales, vel tincidunt lorem condimentum. Cras rhoncus molestie mollis. Suspendisse. ",
                    ImageURL = "https://i.gyazo.com/4c62c1999e93cd1ca01376a03a75a5a0.png"
                },
                new Gift {
                    Id = 2,
                    Url = "http://www.oxybul.com/jeux-d-imagination/circuits-voitures-et-trains/circuits/circuit-de-voiture-3d-infrarouge-frequence-a/produit/313117",
                    Name = "Circuit",
                    Price = "70",
                    Currency =  "€",
                    Description =  "Vivamus eu velit nec tellus maximus tincidunt. Quisque ut erat et ex ornare pretium. Praesent feugiat hendrerit magna sit amet vehicula.nean sed odio quam.  ",
                    ImageURL = "http://images.king-jouet.com/6/GU225653_6.jpg"
                },
                new Gift {
                    Id = 3,
                    Url = "http://www.priceminister.com/offer/buy/223727295/baby-foot-calcio.html?gclid=CJ_20baGn8kCFU-3GwodAtIHUA#sort=0&filter=10&bbaid=652942720&xtatc=PUB-%5Bggp%5D-%5BEnfant%5D-%5Bjeux-cafe%5D-%5B223727295%5D-%5Bneuf%5D-%5Brdvdeco%5D&t=&ptnrid=s9V1S5FxD_dc|pcrid|53687075363|pkw||pmt|&ja1=tsid:67590|cid:287443283|agid:14497925483|tid:kwd-90083637443|crid:53687075363|nw:g|rnd:11301557471419984015|dvc:c|adp:1o2",
                    Name = "Baby Foot",
                    Price = "9.99",
                    Currency =  "€",
                    Description =  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vulputate et risus sit amet elementum. ",
                    ImageURL = "http://images.king-jouet.com/140/GU179709_140.jpg"
                }
            };

            _nextId = gifts.Count() + 1;
        }

        public IEnumerable<Gift> GetAll()
        {
            return gifts;
        }

        public Gift Get(int id)
        {
            return gifts.Find(p => p.Id == id);
        }

        public Gift Add(Gift item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            item.Id = _nextId++;
            gifts.Add(item);
            return item;
        }

        public void Remove(int id)
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
