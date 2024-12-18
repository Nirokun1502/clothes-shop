using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using CLOTHES_SHOP.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CLOTHES_SHOP.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionService _promotionService;

        public PromotionController(IPromotionService promotionService)
        {
            _promotionService = promotionService;
        }

        [HttpGet(Name = "GetAllPromotions"), Authorize]
        public async Task<ActionResult<List<object>>> GetAllPromotions()
        {
            var result = await _promotionService.GetAllPromotions();
            return Ok(result);
        }

        [HttpGet("{id}"), Authorize]
        public async Task<ActionResult<object>> GetPromotionById(int id)
        {
            var result = await _promotionService.GetPromotionById(id);
            if (result == null)
            {
                return NotFound("Promotion not found");
            }

            return Ok(result);
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<Promotion>> AddPromotion(PromotionDTO request)
        {
            var result = await _promotionService.AddPromotion(request);
            if (result == null)
            {
                return NotFound("Invalid request");
            }
            return Ok(result);
        }
        [HttpPut, Authorize]
        public async Task<ActionResult<Promotion>> UpdatePromotionById(int id, PromotionDTO request)
        {
            var result = await _promotionService.UpdatePromotionById(id, request);
            if (result == null)
            {
                return NotFound("Invalid request or Promotion not found");
            }
            return Ok(result);
        }

        [HttpDelete, Authorize]
        public async Task<ActionResult<Promotion>> DeletePromotionById(int id)
        {
            var result = await _promotionService.DeletePromotionById(id);
            if (result == null)
            {
                return NotFound("Promotion not found");
            }
            return Ok(result);
        }

        [HttpPost("ProductPromotions"), Authorize]
        public async Task<ActionResult<Promotion>> AddProductPromotionById(Promotion_Details request)
        {
            var result = await _promotionService.AddProductPromotionById(request);
            if (result == null)
            {
                return NotFound("Invalid request or ProductPromotion not found");
            }
            return Ok(result);
        }

        [HttpPut("ProductPromotions"), Authorize]
        public async Task<ActionResult<Promotion_Details>> UpdateProductPromotionById(Promotion_Details request)
        {
            var result = await _promotionService.UpdateProductPromotionById(request);
            if (result == null)
            {
                return NotFound("Invalid request or ProductPromotion not found");
            }
            return Ok(result);
        }

        [HttpDelete("ProductPromotions"), Authorize]
        public async Task<ActionResult<Promotion>> DeleteProductPromotionById(int productId, int promotionId)
        {
            var result = await _promotionService.DeleteProductPromotionById(productId, promotionId);
            if (result == null)
            {
                return NotFound("ProductPromotion not found");
            }
            return Ok(result);
        }

    }

}
