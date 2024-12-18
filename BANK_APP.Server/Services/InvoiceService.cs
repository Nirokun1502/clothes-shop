using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace CLOTHES_SHOP.Server.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly DataContext _context;

        public InvoiceService(DataContext context)
        {
            _context = context;
        }

       public async Task<List<object>?> GetAllInvoices()
        {
            var invoices = await _context.INVOICE
            .Include(i => i.Order)
            .ToListAsync();

            List<object> result = invoices.Cast<object>().ToList();

            return result;
        }

        public async Task<object?> GetInvoiceByOrderId(int id)
        {
            var order = await _context.ORDER
                .Where(o => o.Order_Id == id)
                .Include(o => o.Invoice)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return null;
            }

            return order;
        }

        public async Task<Invoice?> CreateInvoiceByOrderId(int orderId, int staffId)
        {
            var order = await _context.ORDER.FindAsync(orderId);
            if (order == null)
            {
                return null;
            }

            var staff = await _context.ACCOUNT.FindAsync(staffId);
            if (staff == null)
            {
                return null;
            }

            var inv = await _context.INVOICE.Where(i => i.Order_Id == orderId)
                                            .FirstOrDefaultAsync();
            if (inv != null)
            {
                return null;
            }

            Invoice invoice = new Invoice();
            invoice.Order_Id = orderId;
            invoice.Staff_Id = staffId;
            invoice.Create_At = DateTime.Now;

            _context.INVOICE.Add(invoice);
            await _context.SaveChangesAsync();

            return invoice;
        }

        public async Task<Invoice?> UpdateInvoiceById(int invoiceId, int staffId)
        {
            var invoice = await _context.INVOICE.FindAsync(invoiceId);
            if (invoice == null)
            {
                return null;
            }

            invoice.Staff_Id = staffId;
            invoice.Create_At = DateTime.Now;
            await _context.SaveChangesAsync();

            return invoice;
        }

        public async Task<Order?> DeleteInvoiceById(int invoiceId)
        {
            var invoice = await _context.INVOICE.FindAsync(invoiceId);
            if (invoice == null)
            {
                return null;
            }

            var order = await _context.ORDER.FindAsync(invoice.Order_Id);
            if (invoice == null)
            {
                return null;
            }

            _context.INVOICE.Remove(invoice);
            await _context.SaveChangesAsync();

            return order;
        }


    }
}
