using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace CLOTHES_SHOP.Server.Services
{
    public class AddressService : IAddressService
    {
        private readonly DataContext _context;

        public AddressService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetAllAddresses()
        {
            var accounts = await _context.ACCOUNT
           .Include(c => c.Addresses)
           .Select(account => new
           {
               Id = account.Account_Id,
               account.Username,
               Full_Name = account.Last_Name + account.First_Name,
               Address = account.Addresses
           })
           .ToListAsync();

            List<object> result = accounts.Cast<object>().ToList();

            return result;
        }

        public async Task<object?> GetAccountAddressById(int id)
        {
            var account = await _context.ACCOUNT
                .Where(c => c.Account_Id == id)
                .Select(account => new
                {
                    AccountId = account.Account_Id,
                    account.Username,
                    Full_Name = account.Last_Name + account.First_Name,
                    Address = account.Addresses
                })
                .FirstOrDefaultAsync();

            if (account == null)
            {
                return null;
            }

            return account;
        }
        public async Task<Address?> AddAccountAddressById(int id, AddressDTO request)
        {
            var account = await _context.ACCOUNT.FindAsync(id);
            if (account == null)
            {
                return null;
            }

            Address address = new Address();
            address.Account_Id = id;
            address.City = request.City;
            address.Province = request.Province;
            address.Ward = request.Ward;
            address.Street_Address = request.Street_Address;

            _context.ADDRESS.Add(address);
            await _context.SaveChangesAsync();

            return address;
        }

        public async Task<Address?> UpdateAccountAddressById(int accountId, int addressId, AddressDTO request)
        {
            if (request.Ward == "" || request.City == "" ||
                request.Province == "" || request.Street_Address == "" )
            {
                return null;
            }

            var address = await _context.ADDRESS
                .Where(a => a.Address_Id == addressId
                 && a.Account_Id == accountId)
                .FirstOrDefaultAsync();

            if (address == null)
            {
                return null;
            }

            address.City = request.City;
            address.Province = request.Province;
            address.Ward = request.Ward;
            address.Street_Address = request.Street_Address;
            await _context.SaveChangesAsync();

            return address;

        }

        public async Task<object?> DeleteAccountAddressById(int accountId, int addressId)
        {
            var address = await _context.ADDRESS
                .Where(a => a.Address_Id == addressId
                 && a.Account_Id == accountId)
                .FirstOrDefaultAsync();

            if (address == null)
            {
                return null;
            }
            
            _context.ADDRESS.Remove(address);
            await _context.SaveChangesAsync();

            var account = await _context.ACCOUNT
              .Where(a => a.Account_Id == accountId)
              .Include(a => a.Addresses)
              .FirstOrDefaultAsync();

            return account;
        }


    }
}
