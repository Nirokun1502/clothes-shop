using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Model;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface IAddressService
    {
        Task<List<object>> GetAllAddresses();
        Task<object?> GetAccountAddressById(int id);
        Task<Address?> AddAccountAddressById(int id, AddressDTO request);
        Task<Address?> UpdateAccountAddressById(int accountId, int addressId, AddressDTO request);
        Task<object?> DeleteAccountAddressById(int accountId, int addressId);

    }
}
