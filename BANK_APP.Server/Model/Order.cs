using System.ComponentModel.DataAnnotations;

namespace CLOTHES_SHOP.Server.Model
{
    public class Order
    {
        [Key]
        public int Order_Id { get; set; }
        public int Account_Id { get; set; }
        public double Total_Price { get; set; }
        public int Address_Id { get; set; }
        public DateTime Date_Create { get; set; }
        public string Status { get; set; } = string.Empty;
        public double Total_Discounted_Price { get; set; }

        public Account? Account { get; set; }

        public Address? Address { get; set; }

        public Invoice? Invoice { get; set; }

        public List<Product_Variant>? Product_Variants { get; set; }

        public List<Order_Details>? Order_Details { get; set; }
        public List<Review>? Reviews { get; set; }
    }
}
