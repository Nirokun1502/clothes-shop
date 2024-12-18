using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CLOTHES_SHOP.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionService _permissionService;

        public PermissionController(IPermissionService permissionService)
        {
            _permissionService = permissionService; // đánh dấu rằng class này có thể xài DI của interface
        }

        [HttpGet, Authorize]
        public async Task<ActionResult<List<object>>> GetAllPermissions()
        {
            var result = await _permissionService.GetAllPermissions();
            return Ok(result);
        }

        [HttpGet("GetAccountPermissions")]
        public async Task<ActionResult<List<string>>> GetAllPermissionsByAccountId(int id)
        {
            var result = await _permissionService.GetAllPermissionsByAccountId(id);

            if (result == null)
            {
                return NotFound("Account not found");
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Permission>> GetPermissionById(int id)
        {
            var result = await _permissionService.GetPermissionById(id);
            if (result == null)
            {
                return NotFound("Permission not found");
            }

            return Ok(result);
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<Permission>> AddPermission(PermissionDTO request)
        {
            var result = await _permissionService.AddPermission(request);
            return Ok(result);

        }

        [HttpPut("{id}"), Authorize]
        public async Task<ActionResult<Permission>> UpdatePermission(int id, PermissionDTO request)
        {
            var result = await _permissionService.UpdatePermission(id, request);
            if (result == null)
            {
                return NotFound("Permission not found");
            }
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<List<Permission>>> DeletePermission(int id)
        {
            var result = await _permissionService.DeletePermission(id);
            if (result == null)
            {
                return NotFound("Permission not found");
            }
            return Ok(result);
        }
    }
}
