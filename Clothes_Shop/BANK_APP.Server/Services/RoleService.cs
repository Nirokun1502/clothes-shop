using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CLOTHES_SHOP.Server.Services
{
    public class RoleService : IRoleService
    {
        private readonly DataContext _context;

        public RoleService(DataContext dataContext)
        {
            _context = dataContext;
        }

        public async Task<List<object>> GetAllRoles()
        {
            var roles = await _context.ROLE
                .Include(c => c.Accounts)
                .Include(c => c.Permissions)
                .Select(role => new
                {
                    Id = role.Role_Id,
                    Rolename = role.Role_Name,
                    Roledescription = role.Role_Description,
                    Rolepermissions = role.Permissions.Select(permission => permission.Permission_Name).ToList(),
                    Roleaccounts = role.Accounts.Select(account => account.Username).ToList()
                })
                .ToListAsync();

            List<object> result = roles.Cast<object>().ToList();

            return result;
        }

        public async Task<Role?> GetRoleById(int id)
        {
            var role = await _context.ROLE
                .Where(c => c.Role_Id == id)
                .Include(c => c.Accounts)
                .Include(c => c.Permissions)
                .FirstOrDefaultAsync();

            if (role == null)
            {
                return null;
            }
            return role;
        }

        public async Task<Role?> AddRole(RoleDTO request)
        {
            if (request.Role_Name == null)
            {
                return null;
            }

            if (await _context.ROLE.AnyAsync(a => a.Role_Name == request.Role_Name))
            {
                return null;
            }

            Role role = new Role();
            role.Role_Name = request.Role_Name;
            role.Role_Description = request.Role_Description;

            _context.ROLE.Add(role);
            await _context.SaveChangesAsync();

            return role;
        }

        public async Task<Role?> AddRolePermission(Role_Permissions request)
        {
            var role = await _context.ROLE
                .Where(a => a.Role_Id == request.Role_Id)
                .Include(a => a.Permissions)
                .FirstOrDefaultAsync();

            if (role == null)
            {
                return null;
            }

            var permission = await _context.PERMISSION.FindAsync(request.Permission_Id);
            if (permission == null)
            {
                return null;
            }



            role.Permissions.Add(permission);
            await _context.SaveChangesAsync();

            return role;
        }

        public async Task<Role?> RemoveRolePermission(Role_Permissions request)
        {
            var role = await _context.ROLE
                .Where(a => a.Role_Id == request.Role_Id)
                .Include(a => a.Permissions)
                .FirstOrDefaultAsync();

            if (role == null)
            {
                return null;
            }

            var permission = await _context.PERMISSION.FindAsync(request.Permission_Id);
            if (permission == null)
            {
                return null;
            }



            role.Permissions.Remove(permission);
            await _context.SaveChangesAsync();

            return role;
        }

        public async Task<Role?> UpdateRole(int id, RoleDTO request)
        {
            // check if role name already exist
            if (!await _context.ROLE.AnyAsync(a => a.Role_Name == request.Role_Name))
            {
                return null;
            }

            var role = await _context.ROLE.FindAsync(id);
            if (role == null)
            {
                return null;
            }

            role.Role_Name = request.Role_Name;
            role.Role_Description = request.Role_Description;
            await _context.SaveChangesAsync();

            return role;

        }

        public async Task<List<Role>?> DeleteRole(int id)
        {
            var role = await _context.ROLE.FindAsync(id);
            if (role == null)
            {
                return null;
            }

            _context.ROLE.Remove(role);
            await _context.SaveChangesAsync();

            return await _context.ROLE.ToListAsync();
        }
    }
}
