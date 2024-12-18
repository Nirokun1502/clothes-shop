using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CLOTHES_SHOP.Server.Model
{
    public class Permission
    {
        [Key]
        public int Permission_Id { get; set; }
        public string Permission_Name { get; set; } = string.Empty;
        public string? Permission_Description { get; set; }

        [JsonIgnore]
        public List<Role>? Roles { get; set; }
    }
}
