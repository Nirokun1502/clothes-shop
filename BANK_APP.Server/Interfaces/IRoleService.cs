using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Model;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface IRoleService
    {
        Task<List<object>> GetAllRoles();
        Task<Role?> GetRoleById(int id);
        Task<Role?> AddRole(RoleDTO request);
        Task<Role?> UpdateRole(int id, RoleDTO request);
        Task<List<Role>?> DeleteRole(int id);
        Task<Role?> AddRolePermission(Role_Permissions request);
        Task<Role?> RemoveRolePermission(Role_Permissions request);
    }
}
