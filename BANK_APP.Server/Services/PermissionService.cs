using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace CLOTHES_SHOP.Server.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly DataContext _context;

        public PermissionService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetAllPermissions()
        {
            var permissions = await _context.PERMISSION
           .Include(c => c.Roles)
           .ThenInclude(r => r.Accounts)
           .Select(permission => new
           {
               Id = permission.Permission_Id,
               Permissionname = permission.Permission_Name,
               Permissiondescription = permission.Permission_Description,
               Permissionroles = permission.Roles.Select(role => role.Role_Name).ToList(),
               Permissionaccounts = permission.Roles.SelectMany(role => role.Accounts.Select(account => account.Username)).ToList()
           })
           .ToListAsync();

            List<object> result = permissions.Cast<object>().ToList();

            return result;
        }

        public async Task<List<string>> GetAllPermissionsByAccountId(int id)
        {
            var account = await _context.ACCOUNT
            .Where(a => a.Account_Id == id)
            .Include(a => a.Roles)
                .ThenInclude(r => r.Permissions)
            .FirstOrDefaultAsync();


            if (account == null)
            {
                return null;
            }

            // Lấy danh sách quyền từ các role
            var permissions = account.Roles
                .SelectMany(role => role.Permissions)
                .Select(permission => permission.Permission_Name)
                .Distinct()
                .ToList();

            return permissions;
        }

        public async Task<Permission?> GetPermissionById(int id)
        {
            var permission = await _context.PERMISSION.FindAsync(id);
            if (permission == null)
            {
                return null;
            }
            return permission;
        }

        public async Task<Permission?> AddPermission(PermissionDTO request)
        {

            if (request.Permission_Name == null)
            {
                return null;
            }

            if (await _context.PERMISSION.AnyAsync(a => a.Permission_Name == request.Permission_Name))
            {
                return null;
            }

            Permission permission = new Permission();
            permission.Permission_Name = request.Permission_Name;
            permission.Permission_Description = request.Permission_Description;


            _context.PERMISSION.Add(permission);
            await _context.SaveChangesAsync();

            return permission;
        }

        public async Task<Permission?> UpdatePermission(int id, PermissionDTO request)
        {
            var permission = await _context.PERMISSION.FindAsync(id);
            if (permission == null)
            {
                return null;
            }

            permission.Permission_Name = request.Permission_Name;
            permission.Permission_Description = request.Permission_Description;
            await _context.SaveChangesAsync();


            return permission;
        }

        public async Task<List<Permission>?> DeletePermission(int id)
        {
            var permission = await _context.PERMISSION.FindAsync(id);
            if (permission == null)
            {
                return null;
            }

            _context.PERMISSION.Remove(permission);
            await _context.SaveChangesAsync();

            return await _context.PERMISSION.ToListAsync();
        }
    }
}
