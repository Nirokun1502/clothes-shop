using System.ComponentModel.DataAnnotations;

namespace CLOTHES_SHOP.Server.Model
{
    public class Promotion
    {
        [Key]
        public int Promotion_Id { get; set; }
        public string Promotion_Name { get; set; } = string.Empty;
        public DateTime Start_Date { get; set; }
        public DateTime End_Date { get; set;}

        public List<Product>? Products { get; set; }
    }
}
