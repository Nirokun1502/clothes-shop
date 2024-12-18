using System.ComponentModel.DataAnnotations;

namespace CLOTHES_SHOP.Server.Model
{
    public class Address
    {
        [Key]
        public int Address_Id { get; set; }
        public int Account_Id { get; set; }
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string Ward { get; set; } = string.Empty;
        public string Street_Address { get; set; } = string.Empty;
        public Account? Account { get; set; }
        
        public List<Order>? Orders { get; set; }
    }
}
