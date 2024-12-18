using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CLOTHES_SHOP.Server.Model
{
    public class Order_Details
    {
        public int Order_Id { get; set; }
        public int Variant_Id { get; set; }
        public int Quantity { get; set; }
        public int Unit_Price { get; set; }
        public int Discount_Percentage { get; set; }
        public Product_Variant? Product_Variant { get; set; }
        public Order? Order { get; set; }
    }
}
