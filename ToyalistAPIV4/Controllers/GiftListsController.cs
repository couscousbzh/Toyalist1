
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using ToyalistAPIV4.Infrastructure;
using System.Web.Http.Cors;
using ToyalistAPIV4.Models;
using System.Web;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity;

namespace ToyalistAPIV4.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/giftlists")]
    public class GiftListsController : BaseApiController
    {
        static readonly IGiftListRepository repository = new GiftListRepository(new ApplicationDbContext());


        [Authorize]
        [HttpGet]
        public IEnumerable<GiftList> GetAllGiftLists()
        {
            //Ne renvoit que les listes authorisées par le userID/Role            
            ApplicationUser user = System.Web.HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>().FindById(System.Web.HttpContext.Current.User.Identity.GetUserId());

            if (User.IsInRole("Admin"))
                return repository.GetAll();
             else
                return repository.GetAllGiftListsByUserId(user.Id);
        }

        //[Authorize]
        //[HttpGet]
        //[Route("user/{userid}")]
        //public IEnumerable<GiftList> GetAllGiftListsByUserId(string userid)
        //{
        //    return repository.GetAllGiftListsByUserId(userid);
        //}


        //[Authorize]
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

        [Authorize]
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
                //Récupération de l'id de l'utilisateur en cours
                ApplicationUser user = System.Web.HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>().FindById(System.Web.HttpContext.Current.User.Identity.GetUserId());
                giftList.OwnerUserId = user.Id;

                GiftList createdGiftList = repository.Add(giftList);
                
                return Ok(createdGiftList);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [Authorize]
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

            
        [Authorize]
        [HttpDelete]
        public HttpResponseMessage DeleteGiftList(string  id)
        {
            try
            {
                GiftList item = repository.Get(id);
                if (item == null)
                {
                    return new HttpResponseMessage(HttpStatusCode.NotFound);
                }
                else
                {
                    //Check if list belong to current user or admin
                    ApplicationUser user = System.Web.HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>().FindById(System.Web.HttpContext.Current.User.Identity.GetUserId());
                    //&& user.Roles.Any()

                    bool isUserAdmin = User.IsInRole("Admin");                    

                    if (item.OwnerUserId != user.Id && !isUserAdmin)
                       return new HttpResponseMessage(HttpStatusCode.Forbidden);
                }

                repository.Remove(item);

                return new HttpResponseMessage(HttpStatusCode.OK);

            }
            catch (Exception)
            {                
                return new HttpResponseMessage(HttpStatusCode.InternalServerError);
            }
        }


    }

}
