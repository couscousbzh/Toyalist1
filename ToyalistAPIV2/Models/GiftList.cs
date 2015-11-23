using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Runtime.Serialization;

namespace ToyalistAPIV2.Models
{
   
    public class GiftList
    { 
        public string Sid { get; set; }

        public string Name { get; set; }

        public string TotalPrice { get; set; }

        public bool IsOwnerTheBeneficary { get; set; } //Permet de savoir si le créateur de la liste (owner) est le bénéficiaire des cadeaux, cela permettrait d'afficher ou non la liste des personnes qui prennent en charge le cadeau

        public string UserSid { get; set; }



        // La j'ai un soucis de conception, 
        // d'un point de vue EntityFramework ca aurait du sens de mettre la liste des cadeaux dans cet objet liste.
        // mais d'un point de vu Restful, on peut pas, tout est découplé, du coup il faut rajouter l'id de la liste dans chaque objet gift, 
        //pour l'associer à cette liste tout en dissociant les deux entités liste et cadeau
        //public List<Gift> Gifts { get; set; }

    }
}
