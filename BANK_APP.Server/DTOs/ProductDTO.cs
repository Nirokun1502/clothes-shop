namespace CLOTHES_SHOP.Server.DTOs
{
    public class ProductDTO
    {
        public string Product_Name { get; set; } = String.Empty;
        public string Image {  get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public bool Is_Active { get; set; }
        public int Sold_Quantity { get; set; }
    }

    public class ProductVariantDTO
    {
        public string Variant_Name { get; set; } = String.Empty;
        public int Price { get; set; }
        public int In_Stock { get; set; }
        public int Sold_Quantity { get; set; }
        public string Image { get; set; } = string.Empty;

    }
}
