using System.ComponentModel.DataAnnotations;

namespace CLOTHES_SHOP.Server.Model
{
    public class Cart
    {
        [Key]
        public int Cart_Id { get; set; }
        public int Account_Id { get; set; }

        public List<Product_Variant>? Product_Variants { get; set; }

        public Account? Account { get; set; }
    }
}