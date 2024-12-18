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
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoiceController (IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpGet(Name = "GetAllInvoices"), Authorize]
        public async Task<ActionResult<List<object>>> GetAllInvoices()
        {
            var result = await _invoiceService.GetAllInvoices();
            return Ok(result);
        }

        [HttpGet("{id}"), Authorize]
        public async Task<ActionResult<object>> GetInvoiceByOrderId(int id)
        {
            var result = await _invoiceService.GetInvoiceByOrderId(id);
            if (result == null)
            {
                return NotFound("Invoice not found");
            }

            return Ok(result);
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<Invoice>> CreateInvoiceByOrderId(int orderId, int staffId)
        {
            var result = await _invoiceService.CreateInvoiceByOrderId(orderId, staffId);
            if (result == null)
            {
                return NotFound("Order or Staff not found, or Order Invoice already exist");
            }

            return Ok(result);
        }

        [HttpPut, Authorize]
        public async Task<ActionResult<Invoice?>> UpdateInvoiceById(int invoiceId, int staffId)
        {
            var result = await _invoiceService.UpdateInvoiceById(invoiceId, staffId);
            if (result == null)
            {
                return NotFound("Invoice or Staff not found");
            }

            return Ok(result);
        }

        [HttpDelete, Authorize]
        public async Task<ActionResult<Order?>> DeleteInvoiceById(int invoiceId)
        {
            var result = await _invoiceService.DeleteInvoiceById(invoiceId);
            if (result == null)
            {
                return NotFound("Invoice not found");
            }

            return Ok(result);
        }





    }
}
