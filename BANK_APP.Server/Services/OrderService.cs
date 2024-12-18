using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace CLOTHES_SHOP.Server.Services
{
    public class OrderService : IOrderService
    {
        private readonly DataContext _context;

        public OrderService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<object>?> GetAllOrders()
        {

            var orders = await _context.ORDER
            .Select(order => new
            {
                OrderId = order.Order_Id,
                TotalPrice = (double)order.Total_Price,
                TotalDiscountedPrice = (double)order.Total_Discounted_Price,
                OrderStatus = order.Status,
                DateCreated = order.Date_Create,
                Address = order.Address,
                OrderItems = order.Order_Details
                   .Select(od => new
                   {
                       Quantity = od.Quantity,
                       UnitPrice = od.Unit_Price,
                       DiscountPercentage = od.Discount_Percentage,
                       Variant = od.Product_Variant,
                       ProductName = od.Product_Variant.Product.Product_Name
                   }).ToList()
            }).ToListAsync();

            List<object> result = orders.Cast<object>().ToList();

            return result;
        }

        public async Task<List<object>?> GetOrderByAccountId(int id)
        {
            var order = await _context.ORDER
               .Where(o => o.Account_Id == id)
               .Select(order => new
               {
                   OrderId = order.Order_Id,
                   TotalPrice = (double)order.Total_Price,
                   TotalDiscountedPrice = (double)order.Total_Discounted_Price,
                   OrderStatus = order.Status,
                   DateCreated = order.Date_Create,
                   Address = order.Address,
                   OrderItems = order.Order_Details
                   .Select(od=> new
                {
                    Quantity = od.Quantity,
                    UnitPrice = od.Unit_Price,
                    DiscountPercentage = od.Discount_Percentage,
                    Variant = od.Product_Variant,
                    ProductName = od.Product_Variant.Product.Product_Name


                   }).ToList()
               }).ToListAsync();


            if (order == null)
            {
                return null;
            }

            List<object> result = order.Cast<object>().ToList();


            return result;
        }


        public async Task<Order?> AddOrderbyAccountId(int accountId, int addressId, OrderDTO request)
        {
            if (request.Total_Price <= 0 || request.Status == "" ||
                request.Total_Discounted_Price <=0)
            {
                return null;
            }

            //check if account and address already exist
            if (!await _context.ACCOUNT.AnyAsync(a => a.Account_Id == accountId) ||
                !await _context.ADDRESS.AnyAsync(c => c.Address_Id == addressId && c.Account_Id == accountId  ))
            {
                return null;
            }

            Order order = new Order();

            order.Account_Id = accountId;
            order.Address_Id = addressId;
            order.Total_Price = request.Total_Price;
            order.Total_Discounted_Price = request.Total_Discounted_Price;
            order.Status = request.Status;
            order.Date_Create = DateTime.Now;

            _context.ORDER.Add(order);
            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<Order?> UpdateOrder(int orderId, int addressId, OrderDTO request)
        {
            if (request.Total_Price <= 0 || request.Status == "" ||
                request.Total_Discounted_Price <= 0)
            {
                return null;
            }

            //check if order and address already exist
            var order = await _context.ORDER.FindAsync(orderId);
            if (order == null ||
                !await _context.ADDRESS.AnyAsync(c => c.Address_Id == addressId && c.Account_Id == order.Account_Id))
            {
                return null;
            }

            order.Address_Id = addressId;
            order.Total_Price = request.Total_Price;
            order.Total_Discounted_Price = request.Total_Discounted_Price;
            order.Status = request.Status;
            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<Order?> UpdateOrderStatus(int orderId, string status)
        {
            var order = await _context.ORDER.FindAsync(orderId);
            if (order == null )
             { 
                return null;
            }

            order.Status = status;
            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<Account?> DeleteOrder(int id)
        {
            var order = await _context.ORDER.FindAsync(id);
            if (order == null)
            {
                return null;
            }

            var account = await _context.ACCOUNT
              .Where(a => a.Account_Id == order.Account_Id)
              .Include(a => a.Orders)
              .FirstOrDefaultAsync();
            if (account == null)
            {
                return null;
            }

            _context.ORDER.Remove(order);
            await _context.SaveChangesAsync();

            return account;
        }

        public async Task<Order?> AddOrderItemById(OrderDetailDTO request)
        {
            if (request.Quantity <= 0 || request.Unit_Price <= 0 ||
                request.Discount_Percentage < 0)
            {
                return null;
            }

            var order = await _context.ORDER
             .Where(a => a.Order_Id == request.Order_Id)
             .Include(a => a.Product_Variants)
             .FirstOrDefaultAsync();

            if (order == null)
            {
                return null;
            }

            var item = await _context.PRODUCT_VARIANT.FindAsync(request.Variant_Id);
            if (item == null)
            {
                return null;
            }

            var orderItem = await _context.ORDER_DETAILS
               .Where(c => c.Order_Id == request.Order_Id
                   && c.Variant_Id == request.Variant_Id)
               .FirstOrDefaultAsync();

            if (orderItem != null)
            {
                return null;
            }


            Order_Details newItem = new Order_Details();
            newItem.Order_Id = request.Order_Id;
            newItem.Variant_Id = request.Variant_Id;
            newItem.Quantity = request.Quantity;
            newItem.Unit_Price = request.Unit_Price;
            newItem.Discount_Percentage = request.Discount_Percentage;

            _context.ORDER_DETAILS.Add(newItem);
            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<Order_Details?> UpdateOrderItemById(OrderDetailDTO request)
        {
            if (request.Quantity <= 0 || request.Unit_Price <= 0 ||
                request.Discount_Percentage < 0)
            {
                return null;
            }

            var orderItem = await _context.ORDER_DETAILS
               .Where(c => c.Order_Id == request.Order_Id
                && c.Variant_Id == request.Variant_Id)
               .FirstOrDefaultAsync();

            if (orderItem == null )
            {
                return null;
            }


            orderItem.Quantity = request.Quantity;
            orderItem.Unit_Price = request.Unit_Price;
            orderItem.Discount_Percentage = request.Discount_Percentage;
            await _context.SaveChangesAsync();

            return orderItem;
        }

        public async Task<Order?> RemoveOrderItemByOrderId(int orderId, int itemId)
        {
            var order = await _context.ORDER
                .Where(a => a.Order_Id == orderId)
                .Include(a => a.Product_Variants)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return null;
            }

            var item = await _context.PRODUCT_VARIANT.FindAsync(itemId);
            if (item == null)
            {
                return null;
            }

            var orderItem = await _context.ORDER_DETAILS
                .Where(od => od.Order_Id == orderId && od.Variant_Id == itemId)
                .FirstOrDefaultAsync();

            if (orderItem == null)
            {
                return null;
            }

            _context.ORDER_DETAILS.Remove(orderItem);
            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<List<object>> GetMonthlyRevenue(int year)
        {
            var monthlyRevenue = await _context.ORDER
                .Where(o => o.Status == "delivered" && o.Date_Create.Year == year)
                .GroupBy(o => new { o.Date_Create.Month, o.Date_Create.Year })
                .Select(g => new 
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    TotalRevenue = g.Sum(o => o.Total_Price)
                })
                .OrderBy(mr => mr.Month)
                .ToListAsync();

            List<object> result = monthlyRevenue.Cast<object>().ToList();

            return result;
        }

    }
}
