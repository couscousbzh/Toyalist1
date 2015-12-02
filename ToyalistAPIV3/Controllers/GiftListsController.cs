
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;

//using System.Web.Http.Cors;
using ToyalistAPIV3.Models;

namespace ToyalistAPIV3.Controllers
{
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class GiftListsController : ApiController
    {
        static readonly IGiftListRepository repository = new GiftListRepository();

        [Authorize]
        [HttpGet]
        public IEnumerable<GiftList> GetAllGiftLists()
        {

            return repository.GetAll();
        }

        [HttpGet]
        public IHttpActionResult GetGiftList(string id)
        {
            GiftList item = repository.Get(id);
            if (item == null)
            {
                NotFound(); //Renvois un code 200 et un body vide. 
            }
            return Ok(item);
        }

        //[HttpGet]
        //public HttpResponseMessage GetGiftList(string id)
        //{
        //    GiftList item = repository.Get(id);
        //    if (item == null)
        //    {
        //        return new HttpResponseMessage(HttpStatusCode.NoContent);
        //    }

        //    string json = JsonConvert.SerializeObject(item);
        //    HttpResponseMessage httpResponseMessage = new HttpResponseMessage(HttpStatusCode.OK);
        //    httpResponseMessage.Content = new StringContent(json);
        //    httpResponseMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

        //    return httpResponseMessage;
        //}

        [HttpPost]
        public async Task<IHttpActionResult> Post(GiftList giftList)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.SelectMany(x => x.Value.Errors.Select(z => z.Exception));
                return BadRequest(ModelState);
            }

            try
            {
                GiftList createdGiftList = repository.Add(giftList);

                //TO DO : ajout en BD 


                return Ok(createdGiftList);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPut]
        public IHttpActionResult PutGiftList(string id, GiftList giftList)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != giftList.Id)
            {
                return BadRequest();
            }

            //db.Entry(giftList).State = EntityState.Modified;

            try
            {
                if (!repository.Update(giftList))
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
        public IHttpActionResult DeleteGift(string  id)
        {
            try
            {
                GiftList item = repository.Get(id);
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
