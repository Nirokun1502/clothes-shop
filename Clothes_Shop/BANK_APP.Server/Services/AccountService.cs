using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.EntityFrameworkCore;
using System.Reflection.PortableExecutable;

namespace CLOTHES_SHOP.Server.Services
{
    public class AccountService : IAccountService
    {

        private readonly DataContext _context;

        public AccountService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetAllAccounts() // add changed here
        {
            var accounts = await _context.ACCOUNT
            .Include(c => c.Roles)
            .ThenInclude(r => r.Permissions)
            .Select(account => new
            {
                Id = account.Account_Id,
                account.Username,
                Roles = account.Roles.Select(role => role.Role_Name).ToList(),
                Permissions = account.Roles.SelectMany(role => role.Permissions.Select(permission => permission.Permission_Name)).ToList()
            })
            .ToListAsync();

            List<object> result = accounts.Cast<object>().ToList();

            return result;

        }

        public async Task<Account?> GetAccountById(int id)
        {
            var account = await _context.ACCOUNT
                .Where(c => c.Account_Id == id)
                .Include(c => c.Roles)
                .ThenInclude(role => role.Permissions)
                .FirstOrDefaultAsync();


            if (account == null)
            {
                return null;
            }
            return account;
        }

        public async Task<Account?> GetAccountByUsername(string username)
        {
            var account = await _context.ACCOUNT
                .Where(c => c.Username == username)
                .Include(c => c.Roles)
                .FirstOrDefaultAsync();

            if (account == null)
            {
                return null;
            }
            return account;
        }

        //public async Task<List<Role>> GetRolesByAccountId(int id)
        //{
        //    var account = _context.ACCOUNT
        //        .Where(c => c.Account_Id == id)
        //        .Include(c => c.Roles);

        //    return account;
        //}

        public async Task<Account?> AddAccount(AccountDTO request)
        {
            if (request.Username == "" || request.Password == "" || 
                request.Email == "" || request.First_Name == "" || 
                request.Last_Name == "" || request.Phone == "")
            {
                return null;
            }

            if (await _context.ACCOUNT.AnyAsync(a => a.Username == request.Username) ||
                await _context.ACCOUNT.AnyAsync(a => a.Email == request.Email) ||
                await _context.ACCOUNT.AnyAsync(a => a.Phone == request.Phone))
            {
                return null;
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            
            Role existedRole = await _context.ROLE.FirstOrDefaultAsync(a => a.Role_Name == "ACTIVE_USER");
          

            Account account = new Account();
            account.Roles = new List<Role>();

            account.Username = request.Username;
            account.Password = passwordHash;
            account.Email = request.Email;
            account.First_Name = request.First_Name;
            account.Last_Name = request.Last_Name;
            account.Phone = request.Phone;
            account.Create_At = DateTime.Now;

            account.Roles.Add(existedRole);

            _context.ACCOUNT.Add(account);
            await _context.SaveChangesAsync();

            return account;
        }

        public async Task<Account?> AddAccountRole(Account_Roles request)
        {
            var account = await _context.ACCOUNT
                .Where(a => a.Account_Id == request.Account_Id)
                .Include(a => a.Roles)
                .FirstOrDefaultAsync();

            if (account == null)
            {
                return null;
            }

            var role = await _context.ROLE.FindAsync(request.Role_Id);
            if (role == null)
            {
                return null;
            }



            account.Roles.Add(role);
            await _context.SaveChangesAsync();

            return account;
        }

        public async Task<Account?> RemoveAccountRole(Account_Roles request)
        {
            var account = await _context.ACCOUNT
                .Where(a => a.Account_Id == request.Account_Id)
                .Include(a => a.Roles)
                .FirstOrDefaultAsync();

            if (account == null)
            {
                return null;
            }

            var role = await _context.ROLE.FindAsync(request.Role_Id);

            if (role == null)
            {
                return null;
            }



            account.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return account;
        }

        public async Task<Account?> UpdateAccount(int id, AccountDTO request) //need some fix
        {
            var account = await _context.ACCOUNT.FindAsync(id);
            if (account == null)
            {
                return null;
            }

            account.Email = request.Email;
            account.First_Name = request.First_Name;
            account.Last_Name = request.Last_Name;
            account.Phone = request.Phone;

            await _context.SaveChangesAsync();


            return account;
        }

        public async Task<List<Account>?> DeleteAccount(int id)
        {
            var account = await _context.ACCOUNT.FindAsync(id);
            if (account == null)
            {
                return null;
            }

            _context.ACCOUNT.Remove(account);
            await _context.SaveChangesAsync();

            return await _context.ACCOUNT.ToListAsync();
        }

        public async Task<Account?> UpdateAccountDefaultAddress(int accountId, int addressId)
        {
            var account = await _context.ACCOUNT
             .Where(a => a.Account_Id == accountId && a.Addresses
             .Any(ad => ad.Address_Id == addressId))
             .FirstOrDefaultAsync();

            if (account == null)
            {
                return null;
            }

            account.Default_Address_Id = addressId;
            await _context.SaveChangesAsync();

            return account;
        }


    }
}
