using System.ComponentModel.DataAnnotations;

namespace CLOTHES_SHOP.Server.Model
{
    public class Review
    {
        [Key]
        public int Review_Id { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime Review_Date { get; set; }
        public int Rating { get; set; }
        public int Order_Id { get; set; }
        public int Variant_Id { get; set; }
        public Product_Variant? Product_Variant { get; set; }
        public Order? Order { get; set; }


    }
}
