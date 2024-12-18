using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface IReviewService
    {
        Task<List<object>?> GetAllReviews();
        Task<object?> GetReviewByProductId(int productId);
        Task<Review?> CreateReviewByVariantId(int variantId, int orderId, ReviewDTO request);
        Task<Review?> UpdateReviewById(int reviewId, ReviewDTO request);
        Task<string?> DeleteReviewById(int reviewId);
    }
}
