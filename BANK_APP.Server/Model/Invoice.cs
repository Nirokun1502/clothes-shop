using System.ComponentModel.DataAnnotations;

namespace CLOTHES_SHOP.Server.Model
{
    public class Invoice
    {
        [Key]
        public int Invoice_Id { get; set; }
        public int Order_Id { get; set; }
        public DateTime Create_At { get; set; }
        public int Staff_Id { get; set; }

        public Account? Account { get; set; }
        
        public Order? Order { get; set; }
    }
}
