using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToyalistAPIV2.Models
{
    public class GiftListRepository : IGiftListRepository
    {
        private List<GiftList> allGiftList = new List<GiftList>();
     
        //Constuctor    
        public GiftListRepository()
        {
            GenerateFakeGiftLists();
        }

        public IEnumerable<GiftList> GetAll()
        {
            return allGiftList;
        }

        public GiftList Get(string sid)
        {
            return allGiftList.Find(p => p.Sid == sid);
        }

        public GiftList Add(GiftList item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            item.Sid = Tools.GetRandomKey();
            allGiftList.Add(item);
            return item;
        }

        public void Remove(string  sid)
        {
            allGiftList.RemoveAll(p => p.Sid == sid);
        }

        public bool Update(GiftList item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            int index = allGiftList.FindIndex(p => p.Sid == item.Sid);
            if (index == -1)
            {
                return false;
            }
            allGiftList.RemoveAt(index);
            allGiftList.Add(item);
            return true;
        }



        private void GenerateFakeGiftLists()
        {
            allGiftList = new List<GiftList>();

            GiftList giftList1 = new GiftList();
            giftList1.Sid = "julie1";
            giftList1.Name = "La liste des cadeaux de Julie";
            //giftList1.Gifts = new List<Gift>
            //{
            //    new Gift {
            //        Id = 1,
            //        Url = "http://www.auchan.fr/mattel-barbie-robe-de-mariee/p-c377746",
            //        Name = "Poupée",
            //        Price = "13",
            //        Currency =  "$",
            //        Description =  "Fusce vitae sodales nunc. Nullam vehicula nulla sed ligula sodales, vel tincidunt lorem condimentum. Cras rhoncus molestie mollis. Suspendisse. ",
            //        ImageURL = "https://i.gyazo.com/4c62c1999e93cd1ca01376a03a75a5a0.png"
            //    },
            //    new Gift {
            //        Id = 2,
            //        Url = "http://www.oxybul.com/jeux-d-imagination/circuits-voitures-et-trains/circuits/circuit-de-voiture-3d-infrarouge-frequence-a/produit/313117",
            //        Name = "Circuit",
            //        Price = "70",
            //        Currency =  "€",
            //        Description =  "Vivamus eu velit nec tellus maximus tincidunt. Quisque ut erat et ex ornare pretium. Praesent feugiat hendrerit magna sit amet vehicula.nean sed odio quam.  ",
            //        ImageURL = "http://images.king-jouet.com/6/GU225653_6.jpg"
            //    },
            //    new Gift {
            //        Id = 3,
            //        Url = "http://www.priceminister.com/offer/buy/223727295/baby-foot-calcio.html?gclid=CJ_20baGn8kCFU-3GwodAtIHUA#sort=0&filter=10&bbaid=652942720&xtatc=PUB-%5Bggp%5D-%5BEnfant%5D-%5Bjeux-cafe%5D-%5B223727295%5D-%5Bneuf%5D-%5Brdvdeco%5D&t=&ptnrid=s9V1S5FxD_dc|pcrid|53687075363|pkw||pmt|&ja1=tsid:67590|cid:287443283|agid:14497925483|tid:kwd-90083637443|crid:53687075363|nw:g|rnd:11301557471419984015|dvc:c|adp:1o2",
            //        Name = "Baby Foot",
            //        Price = "9.99",
            //        Currency =  "€",
            //        Description =  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vulputate et risus sit amet elementum. ",
            //        ImageURL = "http://images.king-jouet.com/140/GU179709_140.jpg"
            //    }
            //};
     


            GiftList giftList2 = new GiftList();
            giftList2.Sid = "leo1";
            giftList2.Name = "La liste des cadeaux de leo";
            //giftList2.Gifts = new List<Gift>
            //{
            //    new Gift {
            //        Id = 1,
            //        Url = "http://www.oxybul.com/jeux-d-imagination/circuits-voitures-et-trains/voitures-et-garage/camion-pompier-avec-echelle-et-pompe-a-eau-fonctionnelle/produit/313211",
            //        Name = "Camion de pompier",
            //        Price = "74",
            //        Currency =  "€",
            //        Description =  "Fusce vitae sodales nunc. Nullam vehicula nulla sed ligula sodales, vel tincidunt lorem condimentum. Cras rhoncus molestie mollis. Suspendisse. ",
            //        ImageURL = "http://images.eveiletjeux.net/Photo/IMG_FICHE_PRODUIT/Image/500x500/3/313211.jpg"
            //    },
            //    new Gift {
            //        Id = 2,
            //        Url = "http://fr.aliexpress.com/item/Original-DJI-T600-Inspire-1-Professional-drones-FPV-RC-Quad-copter-drone-with-4K-HD-Camera/32521808891.html?currencyType=EUR&src=google&albch=shopping&acnt=494-037-6276&isdl=y&aff_short_key=UneMJZVf&albcp=287465161&albag=17814773401&slnk=&trgt=18283950120&plac=&crea=fr32521808891&netw=&device=c&mtctp=&gclid=CJqZxa2zpskCFSr3wgodDmwGEg",
            //        Name = "Quad Cop",
            //        Price = "4481",
            //        Currency =  "€",
            //        Description =  "Vivamus eu velit nec tellus maximus tincidunt. Quisque ut erat et ex ornare pretium. Praesent feugiat hendrerit magna sit amet vehicula.nean sed odio quam.  ",
            //        ImageURL = "http://g01.a.alicdn.com/kf/HTB1wVBwKpXXXXXJXXXXq6xXFXXXQ/Original-DJI-T600-Inspire-1-Professional-drones-FPV-RC-Quad-copter-drone-with-4K-HD-Camera.jpg"
            //    },
            //    new Gift {
            //        Id = 3,
            //        Url = "http://www.last-video.com/wp-content/uploads/2014/09/Poney-de-la-taille-dun-chien.jpg",
            //        Name = "Poney",
            //        Price = "2000",
            //        Currency =  "€",
            //        Description =  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vulputate et risus sit amet elementum. ",
            //        ImageURL = "http://www.last-video.com/wp-content/uploads/2014/09/Poney-de-la-taille-dun-chien.jpg"
            //    }
            //};

            allGiftList.Add(giftList1);
            allGiftList.Add(giftList2);
        }

    }
}
