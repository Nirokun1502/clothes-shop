using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Model;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface IAccountService
    {
        Task<List<object>> GetAllAccounts();
        Task<Account?> GetAccountById(int id);
        Task<Account?> AddAccount(AccountDTO request);
        Task<Account?> UpdateAccount(int id, AccountDTO request); // need fix here
        Task<List<Account>?> DeleteAccount(int id);
        Task<Account?> AddAccountRole(Account_Roles request);
        Task<Account?> RemoveAccountRole(Account_Roles request);
        Task<Account?> UpdateAccountDefaultAddress(int accountId, int addressId);

    }
}
