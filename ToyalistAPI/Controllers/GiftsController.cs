using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

using System.Web.Http.Cors;
using ToyalistAPI.Models;

namespace ToyalistAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class GiftsController : ApiController
    {
        //int secondeCacheMemory = 600; //10 min = 600
        //MemoryCacher memCacher = new MemoryCacher();

        //private static List<Gift> dataList = new List<Gift>();

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

        //        dataList = giftListBidon;
        //        //Mise ne cache
        //        memCacher.Add("GiftToken1", dataList, DateTimeOffset.UtcNow.AddSeconds(secondeCacheMemory));
        //    }
        //    else
        //    {
        //        //récupere depuis le cache les données
        //        List<Gift> giftListFromCache = (List<Gift>)memCacher.GetValue("GiftToken1");
        //        dataList = giftListFromCache;
        //    }
        //}

        static readonly IGiftRepository repository = new GiftRepository();


        [HttpGet]
        public IEnumerable<Gift> GetAllGifts()
        {
            //RefreshData();

            //return dataList;

            return repository.GetAll();
        }

        [HttpGet]
        public IHttpActionResult GetGift(int id)
        {
            //RefreshData();

            //var gift = dataList.FirstOrDefault((p) => p.Id == id);
            //if (gift == null)
            //{
            //    return NotFound();
            //}
            //return Ok(gift);

            Gift item = repository.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return Ok(item);

            //return CreatedAtRoute("DefaultApi", new { id = product.ProductId }, product);
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(Gift gift)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.SelectMany(x => x.Value.Errors.Select(z => z.Exception));
                return BadRequest(ModelState);
            }

            try
            {
                repository.Add(gift);

                //TO DO : ajout en BD 


                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPut]
        public IHttpActionResult PutGift(int id, Gift gift)
        {
            //gift.Id = id;
            //if (!repository.Update(gift))
            //{
            //    throw new HttpResponseException(HttpStatusCode.NotFound);
            //}



            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != gift.Id)
            {
                return BadRequest();
            }

            //db.Entry(gift).State = EntityState.Modified;

            try
            {
                if (!repository.Update(gift))
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                }
                //db.SaveChanges();
            }
            catch (Exception) //DbUpdateConcurrencyException
            {
                return NotFound();                
            }

            return StatusCode(HttpStatusCode.NoContent);

            
        }

        [HttpDelete]
        public IHttpActionResult DeleteGift(int id)
        {
            try
            {
                Gift item = repository.Get(id);
                if (item == null)
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                }

                repository.Remove(id);

                return Ok(item);

            }
            catch (Exception) //DbUpdateConcurrencyException
            {
                return NotFound();
            }                  
        }






        //List<Gift> giftListBidon = new List<Gift>
        //{
        //    new Gift {
        //        Id = 1,
        //        Name = "Poupé",
        //        Price = 13,
        //        Currency =  "$",
        //        Description =  "Fusce vitae sodales nunc. Nullam vehicula nulla sed ligula sodales, vel tincidunt lorem condimentum. Cras rhoncus molestie mollis. Suspendisse. ",
        //        ImageURL = "https://i.gyazo.com/4c62c1999e93cd1ca01376a03a75a5a0.png"
        //    },
        //    new Gift {
        //        Id = 2,
        //        Name = "Circuit",
        //        Price = 70,
        //        Currency =  "€",
        //        Description =  "Vivamus eu velit nec tellus maximus tincidunt. Quisque ut erat et ex ornare pretium. Praesent feugiat hendrerit magna sit amet vehicula.nean sed odio quam.  ",
        //        ImageURL = "http://images.king-jouet.com/6/GU225653_6.jpg"
        //    },
        //    new Gift {
        //        Id = 3,
        //        Name = "Baby Foot",
        //        Price = 9.99,
        //        Currency =  "€",
        //        Description =  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vulputate et risus sit amet elementum. ",
        //        ImageURL = "http://images.king-jouet.com/140/GU179709_140.jpg"
        //    }
        //};
    }

}
