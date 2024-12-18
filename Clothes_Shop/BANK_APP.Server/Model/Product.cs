using System.ComponentModel.DataAnnotations;

namespace CLOTHES_SHOP.Server.Model
{
    public class Product
    {
        [Key]
        public int Product_Id { get; set; }
        public string Product_Name { get; set; }
        public string Image {  get; set; }
        public string Description { get; set; }
        public bool Is_Active { get; set; }
        public int Sold_Quantity { get; set; }
        public DateTime Create_At { get; set; }
        public List<Product_Variant>? Product_Variants { get; set; }
        public List<Category>? Categories { get; set; }
        public List<Promotion>? Promotions { get; set; }
    }
}
