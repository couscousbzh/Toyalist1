
using System;
using System.Collections.Generic;

using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

//using System.Web.Http.Cors;
using ToyalistAPIV3.Models;

namespace ToyalistAPIV3.Controllers
{
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class GiftsController : ApiController 
    {
        static readonly IGiftRepository repository = new GiftRepository();


        [HttpGet]
        public IEnumerable<Gift> GetAllGifts()
        {
            return repository.GetAll();
        }

        [HttpGet]
        public IEnumerable<Gift> GetGifts([FromUri]string giftlistid)
        {
            //Requete tous les gifts par leur id de liste a laquelle ils appartiennent.
            IEnumerable<Gift> items = repository.GetByGiftListId(giftlistid);
            if (items == null || items.Count() == 0)
            {
                NotFound(); //retourne un code 200 au lieu d'un 204... tans pis

                //Soit on retourne un objet vide, soit on retourne une réponse HttpResponseMessage avec un code 204 et pas de contenu. 
                //return new HttpResponseMessage(HttpStatusCode.NoContent);
            }
            return items;
        }


        [HttpGet]
        public IHttpActionResult GetGift(string id)
        {
            Gift item = repository.Get(id);
            if (item == null)
            {
                NotFound();
            }
            return Ok(item);           
        }

        [Authorize]
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
                Gift createdGift = repository.Add(gift);

                //TO DO : ajout en BD 


                return Ok(createdGift);
            }
            catch (Exception ex)
            {
                throw ex;
            }

            //return CreatedAtRoute("DefaultApi", new { id = product.ProductId }, product);
        }

        [HttpPut]
        public IHttpActionResult PutGift(string id, Gift gift)
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

            return StatusCode(HttpStatusCode.OK);

            
        }

        [HttpDelete]
        public IHttpActionResult DeleteGift(string id)
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


    }

}
