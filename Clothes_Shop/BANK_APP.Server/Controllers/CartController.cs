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
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController (ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet(Name = "GetAllCarts"), Authorize]
        public async Task<ActionResult<List<object>>> GetAllCarts()
        {
            var result = await _cartService.GetAllCarts();
            return Ok(result);
        }

        [HttpGet("{id}"), Authorize]
        public async Task<ActionResult<object>> GetCartByAccountId(int id)
        {
            var result = await _cartService.GetCartByAccountId(id);
            if (result == null)
            {
                return NotFound("Cart not found");
            }

            return Ok(result);
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<Cart>> CreateCartByAccountId(int accountId)
        {
            var result = await _cartService.CreateCartByAccountId(accountId);
            if (result == null)
            {
                return NotFound("Cart or Account not found");
            }
            return Ok(result);
        }

        [HttpDelete, Authorize]
        public async Task<ActionResult<List<Cart>>> DeleteCartByAccountId(int accountId)
        {
            var result = await _cartService.DeleteCartByAccountId(accountId);
            if (result == null)
            {
                return NotFound("Cart or Account not found");
            }
            return Ok(result);
        }

        [HttpPost("CartItems"), Authorize]
        public async Task<ActionResult<Cart>> AddItemToCartByCartId(Cart_Details request)
        {
            var result = await _cartService.AddItemToCartByCartId(request);
            if (result == null)
            {
                return NotFound("Cart or Item not found");
            }
            return Ok(result);
        }

        [HttpDelete("CartItems"), Authorize]
        public async Task<ActionResult<Cart>> RemoveCartItemByCartId(int cartId, int itemId)
        {
            var result = await _cartService.RemoveCartItemByCartId(cartId, itemId);
            if (result == null)
            {
                return NotFound("Cart or Item not found");
            }
            return Ok(result);
        }

        [HttpPut("CartItems"), Authorize]
        public async Task<ActionResult<Cart_Details>> AdjustCartItemQuantityByCartId(Cart_Details request)
        {
            var result = await _cartService.AdjustCartItemQuantityByCartId(request);
            if (result == null)
            {
                return NotFound("Cart or Item not found");
            }
            return Ok(result);
        }

    }
}
