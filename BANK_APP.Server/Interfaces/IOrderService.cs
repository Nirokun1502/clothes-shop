using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface IOrderService
    {
        Task<List<object>?> GetAllOrders();
        Task<List<object>?> GetOrderByAccountId(int id);
        Task<Order?> AddOrderbyAccountId(int accountId, int addressId, OrderDTO request);
        Task<Order?> UpdateOrder(int orderId, int addressId, OrderDTO request);
        Task<Account?> DeleteOrder(int id);
        Task<Order?> AddOrderItemById(OrderDetailDTO request);
        Task<Order_Details?> UpdateOrderItemById(OrderDetailDTO request);
        Task<Order?> RemoveOrderItemByOrderId(int orderId, int itemId);
        Task<Order?> UpdateOrderStatus(int orderId, string status);
        Task<List<object>> GetMonthlyRevenue(int year);

    }
}
