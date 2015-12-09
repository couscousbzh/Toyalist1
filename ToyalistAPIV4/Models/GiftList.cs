using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Runtime.Serialization;

namespace ToyalistAPIV4.Models
{
   
    public class GiftList
    { 
        public string Id { get; set; }

        public string OwnerUserId { get; set; }

        public string Name { get; set; }

        public string TotalPrice { get; set; }

        public bool IsOwnerTheBeneficary { get; set; } //Permet de savoir si le créateur de la liste (owner) est le bénéficiaire des cadeaux, cela permettrait d'afficher ou non la liste des personnes qui prennent en charge le cadeau

        public string UserSid { get; set; }

        public virtual List<Gift> Gifts { get; set; }

    }
}
