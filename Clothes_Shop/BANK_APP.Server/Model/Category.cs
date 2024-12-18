using System.ComponentModel.DataAnnotations;

namespace CLOTHES_SHOP.Server.Model
{
    public class Category
    {
        [Key]
        public int Category_Id { get; set; }
        public string Category_Name { get; set; }
        public string Image {  get; set; }
        public string Description { get; set;}

        public List<Product>? Products { get; set; }
    }
}
