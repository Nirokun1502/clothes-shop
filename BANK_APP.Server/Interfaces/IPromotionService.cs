using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Model;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface IPromotionService
    {
        Task<List<object>?> GetAllPromotions();
        Task<object?> GetPromotionById(int id);
        Task<Promotion?> AddPromotion(PromotionDTO request);
        Task<Promotion?> UpdatePromotionById(int id, PromotionDTO request);
        Task<List<Promotion>?> DeletePromotionById(int id);
        Task<Promotion?> AddProductPromotionById(Promotion_Details request);
        Task<Promotion_Details?> UpdateProductPromotionById(Promotion_Details request);
        Task<Promotion?> DeleteProductPromotionById(int productId, int promotionId);

    }
}
