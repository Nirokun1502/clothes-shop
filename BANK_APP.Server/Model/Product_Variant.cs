using System.ComponentModel.DataAnnotations;

namespace CLOTHES_SHOP.Server.Model
{
    public class Product_Variant
    {
        [Key]
        public int Variant_Id { get; set; }
        public int Product_Id { get; set;}
        public string Variant_Name { get; set; } = string.Empty;
        public int Price { get; set; }
        public int In_Stock { get; set; }
        public int Sold_Quantity { get; set; }
        public string Image { get; set; } = string.Empty;

        public Product? Product { get; set; }
        public List<Cart>? Carts { get; set; }
        public List<Order>? Orders { get; set; }
        public List<Review>? Reviews { get; set; }

        public List<Order_Details>? Order_Details { get; set; }
    }
}
