namespace CLOTHES_SHOP.Server.DTOs
{
    public class OrderDTO
    {
        public double Total_Price { get; set; }
        public double Total_Discounted_Price { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class OrderDetailDTO
    {
        public int Order_Id { get; set; }
        public int Variant_Id { get; set; }
        public int Quantity { get; set; }
        public int Unit_Price { get; set; }
        public int Discount_Percentage { get; set; }
    }
}
