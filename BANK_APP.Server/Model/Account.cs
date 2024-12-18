// Ignore Spelling: Username

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CLOTHES_SHOP.Server.Model
{
    public class Account
    {
        [Key]
        public int Account_Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string First_Name { get; set; } = string.Empty;
        public string Last_Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime Create_At { get; set; }
        public int Default_Address_Id { get; set; }

        public List<Role>? Roles { get; set; }
        public List<Address>? Addresses { get; set; }
        public List<Order>? Orders { get; set; }

        // hoa don do nhan vien tao
        public List<Invoice>? Invoices { get; set; }
        public Cart? Cart { get; set; }
    }
}
