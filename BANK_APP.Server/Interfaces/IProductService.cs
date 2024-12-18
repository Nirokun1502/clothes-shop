using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Model;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface IProductService
    {
        Task<List<object>> GetAllProducts();
        Task<Product?> GetAllVariantsByProductId(int id);
        Task<Product?> AddProduct(ProductDTO request);
        Task<Product_Variant?> AddVariantByProductId(int productId, ProductVariantDTO request);
        Task<Product?> UpdateProductById(int id, ProductDTO request);
        Task<Product_Variant?> UpdateVariantById(int id, ProductVariantDTO request);
        Task<List<Product>?> DeleteProductById(int id);
        Task<Product?> DeleteVariantById(int id);

        Task<List<object>> SearchProduct(string productName);

    }
}
