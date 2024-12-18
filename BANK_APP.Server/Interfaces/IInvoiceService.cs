using CLOTHES_SHOP.Server.Model;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface IInvoiceService
    {
        Task<List<object>?> GetAllInvoices();
        Task<object?> GetInvoiceByOrderId(int id);
        Task<Invoice?> CreateInvoiceByOrderId(int orderId, int staffId);
        Task<Invoice?> UpdateInvoiceById(int invoiceId, int staffId);
        Task<Order?> DeleteInvoiceById(int invoiceId);
    }
}
