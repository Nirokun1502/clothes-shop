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
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _addressService;

        public AddressController(IAddressService addressService)
        {
            _addressService = addressService;
        }

        [HttpGet(Name = "GetAllAddresses"), Authorize]
        public async Task<ActionResult<List<object>>> GetAllAddresses()
        {
            var result = await _addressService.GetAllAddresses();
            return Ok(result);
        }

        [HttpGet("{id}"), Authorize]
        public async Task<ActionResult<object>> GetAccountAddressById(int id)
        {
            var result = await _addressService.GetAccountAddressById(id);
            if (result == null)
            {
                return NotFound("Account not found");
            }

            return Ok(result);
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<Address?>> AddAccountAddressById(int id, AddressDTO request)
        {
            var result = await _addressService.AddAccountAddressById(id, request);
            if (result == null)
            {
                return NotFound("Invalid request or Account not found");
            }

            return Ok(result);
        }

        [HttpPut, Authorize]
        public async Task<ActionResult<Address?>> UpdateAccountAddressById(int accountId, int addressId, AddressDTO request)
        {
            var result = await _addressService.UpdateAccountAddressById(accountId,addressId, request);
            if (result == null)
            {
                return NotFound("Invalid request or AccountAddress not found");
            }

            return Ok(result);
        }


        [HttpDelete, Authorize]
        public async Task<ActionResult<object?>> DeleteAccountAddressById(int accountId, int addressId)
        {
            var result = await _addressService.DeleteAccountAddressById(accountId, addressId);
            if (result == null)
            {
                return NotFound("AccountAddress not found");
            }

            return Ok(result);
        }

    }
}
