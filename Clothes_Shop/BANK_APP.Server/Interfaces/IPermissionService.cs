using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Model;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface IPermissionService
    {
        Task<List<object>> GetAllPermissions();
        Task<Permission?> GetPermissionById(int id);
        Task<Permission> AddPermission(PermissionDTO request);
        Task<Permission?> UpdatePermission(int id, PermissionDTO request);
        Task<List<Permission>?> DeletePermission(int id);
        Task<List<string>> GetAllPermissionsByAccountId(int id);
    }
}
