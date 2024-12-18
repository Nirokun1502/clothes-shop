using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CLOTHES_SHOP.Server.Model
{
    public class Role
    {
        [Key]
        public int Role_Id { get; set; }
        public string Role_Name { get; set; } = string.Empty;
        public string? Role_Description { get; set; }
        //[JsonIgnore]
        public List<Account>? Accounts { get; set; }
        public List<Permission>? Permissions { get; set; }
    }
}
