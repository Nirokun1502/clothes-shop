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
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController (IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet(Name = "GetAllOrders"), Authorize]
        public async Task<ActionResult<List<object>>> GetAllOrders()
        {
            var result = await _orderService.GetAllOrders();
            return Ok(result);
        }

        [HttpGet("{id}"), Authorize]
        public async Task<ActionResult<List<object>>> GetOrderByAccountId(int id)
        {
            var result = await _orderService.GetOrderByAccountId(id);
            if (result == null)
            {
                return NotFound("Orders not found");
            }

            return Ok(result);
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<Order>> AddOrderbyAccountId(int accountId, int addressId, OrderDTO request)
        {
            var result = await _orderService.AddOrderbyAccountId(accountId, addressId, request);
            if (result == null)
            {
                return NotFound("Invalid request or Account, Address not found");
            }

            return Ok(result);
        }

        [HttpPut, Authorize]
        public async Task<ActionResult<Order>> UpdateOrder(int orderId, int addressId, OrderDTO request)
        {
            var result = await _orderService.UpdateOrder(orderId, addressId, request);
            if (result == null)
            {
                return NotFound("Invalid request or Order, Address not found");
            }

            return Ok(result);
        }

        [HttpDelete, Authorize]
        public async Task<ActionResult<Account>> DeleteOrder(int id)
        {
            var result = await _orderService.DeleteOrder(id);
            if (result == null)
            {
                return NotFound("Order or Account not found");
            }

            return Ok(result);
        }

        [HttpPost("OrderItems"), Authorize]
        public async Task<ActionResult<Order>> AddOrderItemById(OrderDetailDTO request)
        {
            var result = await _orderService.AddOrderItemById(request);
            if (result == null)
            {
                return NotFound("Invalid request or Order, Item not found");
            }

            return Ok(result);
        }

        [HttpPut("OrderItems"), Authorize]
        public async Task<ActionResult<Order_Details>> UpdateOrderItemById(OrderDetailDTO request)
        {
            var result = await _orderService.UpdateOrderItemById(request);
            if (result == null)
            {
                return NotFound("Invalid request or OrderItem not found");
            }

            return Ok(result);
        }

        [HttpDelete("OrderItems"), Authorize]
        public async Task<ActionResult<Order>> RemoveOrderItemByOrderId(int orderId, int itemId)
        {
            var result = await _orderService.RemoveOrderItemByOrderId(orderId, itemId);
            if (result == null)
            {
                return NotFound("Invalid request or OrderItem not found");
            }

            return Ok(result);
        }

        [HttpPut("OrderStatus"), Authorize]
        public async Task<ActionResult<Order?>> UpdateOrderStatus(int orderId, string status)
        {
            var result = await _orderService.UpdateOrderStatus(orderId, status);
            if (result == null)
            {
                return NotFound("Order not found");
            }

            return Ok(result);
        }

        [HttpGet("MonthlyRevenue")]
        public async Task<ActionResult<List<object>>> GetMonthlyRevenue( int year)
        {
            var revenue = await _orderService.GetMonthlyRevenue(year);
            return Ok(revenue);
        }


    }
}
