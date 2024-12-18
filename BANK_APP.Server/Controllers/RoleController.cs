using CLOTHES_SHOP.Server.Services;
using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CLOTHES_SHOP.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IAccountService accountService, IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<ActionResult<List<object>>> GetAllRoles()
        {
            var result = await _roleService.GetAllRoles();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRoleById(int id)
        {
            var result = await _roleService.GetRoleById(id);
            if (result == null)
            {
                return NotFound("Role not found");
            }

            return Ok(result);
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<Role>> AddRole(RoleDTO request)
        {
            var result = await _roleService.AddRole(request);
            return Ok(result);
        }

        [HttpPost("permission"), Authorize]
        public async Task<ActionResult<Role>> AddRolePermission(Role_Permissions request)
        {
            var result = await _roleService.AddRolePermission(request);
            if (result == null)
            {
                return NotFound("Role or Permission not found");
            }
            return Ok(result);
        }

        [HttpDelete("permission"), Authorize]
        public async Task<ActionResult<Role>> RemoveRolePermission(Role_Permissions request)
        {
            var result = await _roleService.RemoveRolePermission(request);
            if (result == null)
            {
                return NotFound("Account or Role not found");
            }
            return Ok(result);
        }

        [HttpPut("{id}"), Authorize]
        public async Task<ActionResult<Role>> UpdateRole(int id, RoleDTO request)
        {
            var result = await _roleService.UpdateRole(id, request);
            if (result == null)
            {
                return NotFound("Role not found");
            }
            return Ok(result);
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<ActionResult<List<Role>>> DeleteRole(int id)
        {
            var result = await _roleService.DeleteRole(id);
            if (result == null)
            {
                return NotFound("Role not found");
            }
            return Ok(result);
        }
    }
}
