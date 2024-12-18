using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using CLOTHES_SHOP.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CLOTHES_SHOP.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet(Name = "GetAllReviews"), Authorize]

        public async Task<ActionResult<List<object>?>> GetAllReviews()
        {
            var result = await _reviewService.GetAllReviews();
            return Ok(result);
        }

        [HttpGet("{productId}"), Authorize]
        public async Task<ActionResult<object?>> GetReviewByProductId(int productId)
        {
            var result = await _reviewService.GetReviewByProductId(productId);
            if (result == null)
            {
                return NotFound("Reviews not found");
            }

            return Ok(result);
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<Review?>> CreateReviewByVariantId(int variantId, int orderId, ReviewDTO request)
        {
            var result = await _reviewService.CreateReviewByVariantId(variantId, orderId, request);
            if (result == null)
            {
                return NotFound("Invalid request or Review Already Exist");
            }

            return Ok(result);
        }

        [HttpPut, Authorize]
        public async Task<ActionResult<Review?>> UpdateReviewById(int reviewId, ReviewDTO request)
        {
            var result = await _reviewService.UpdateReviewById(reviewId, request);
            if (result == null)
            {
                return NotFound("Invalid request or Review not found");
            }

            return Ok(result);
        }

        [HttpDelete, Authorize]
        public async Task<ActionResult<string?>> DeleteReviewById(int reviewId)
        {
            var result = await _reviewService.DeleteReviewById(reviewId);
            if (result == null)
            {
                return NotFound("Review not found");
            }

            return Ok(result);
        }


    }
}
