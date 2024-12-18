using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace CLOTHES_SHOP.Server.Services
{
    public class ReviewService : IReviewService
    {
        private readonly DataContext _context;

        public ReviewService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<object>?> GetAllReviews()
        {
            var reviews = await _context.REVIEW
                .Include(o => o.Order)
                .Include(pv => pv.Product_Variant)
                .Select(review => new
                {
                    ReviewId = review.Review_Id,
                    Comment = review.Comment,
                    ReviewDate = review.Review_Date,
                    Rating = review.Rating,
                    Variant = review.Product_Variant,
                    Order = review.Order,
                }).ToListAsync();

            return reviews.Cast<object>().ToList();
        }

        public async Task<object?> GetReviewByProductId(int productId)
        {
            var reviews = await _context.REVIEW
                .Where(pv => pv.Product_Variant.Product_Id == productId)
                .Include(o => o.Order)
                .Include(pv => pv.Product_Variant)
                .Select(review => new
                {
                    ReviewId = review.Review_Id,
                    Comment = review.Comment,
                    ReviewDate = review.Review_Date,
                    Rating = review.Rating,
                    Variant = review.Product_Variant,
                    Order = review.Order,
                }).ToListAsync();

            if (reviews == null)
            {
                return null;
            }

            return reviews;

        }

        public async Task<Review?> CreateReviewByVariantId(int variantId, int orderId, ReviewDTO request)
        {
            if (request.Rating < 0 || request.Rating > 10) { return null; }

            var orderItem = await _context.ORDER_DETAILS
              .Where(c => c.Order_Id == orderId
                  && c.Variant_Id == variantId)
              .FirstOrDefaultAsync();


            if (orderItem == null)
            {
                return null;
            }

            var RV = await _context.REVIEW
                    .Where(rv => rv.Order_Id == orderId && rv.Variant_Id == variantId)
                    .FirstOrDefaultAsync();

            if (RV != null)
            {
                return null;
            }


            Review review = new Review();
            review.Variant_Id = variantId;
            review.Order_Id = orderId;
            review.Comment = request.Comment;
            review.Rating = request.Rating;
            review.Review_Date = DateTime.Now;
            
            _context.REVIEW.Add(review);
            await _context.SaveChangesAsync();

            return review;
        }

        public async Task<Review?> UpdateReviewById(int reviewId, ReviewDTO request)
        {
            if (request.Rating < 0 || request.Rating > 10) return null;


            var review = await _context.REVIEW.FindAsync(reviewId);
            if (review == null)
            {
                return null;
            }

            review.Comment = request.Comment;
            review.Rating = request.Rating;
            review.Review_Date = DateTime.Now;

            await _context.SaveChangesAsync();

            return review;
        }

        public async Task<string?> DeleteReviewById(int reviewId)
        {
            var review = await _context.REVIEW.FindAsync(reviewId);
            if (review == null)
            {
                return null;
            }

            _context.REVIEW.Remove(review);
            await _context.SaveChangesAsync();

            return "OK";
        }



    }
}
