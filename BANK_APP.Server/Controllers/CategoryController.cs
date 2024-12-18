using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using CLOTHES_SHOP.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CLOTHES_SHOP.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
       private readonly ICategoryService _categoryService;

       public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

       [HttpGet(Name = "GetAllCategories")]
       public async Task<ActionResult<List<object>>> GetAllCategories()
        {
            var result = await _categoryService.GetAllCategories();
            return result;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategoryById(int id)
        {
            var result = await _categoryService.GetCategoryById(id);
            if (result == null)
            {
                return NotFound("Category not found");
            }

            return Ok(result);
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<Category>> AddCategory(CategoryDTO category)
        {
            var result = await _categoryService.AddCategory(category);
            return Ok(result);
        }

        [HttpPost("product"), Authorize]
        public async Task<ActionResult<Category>> AddProductToCategoryById(Category_Details request)
        {
            var result = await _categoryService.AddProductToCategoryById(request);
            if (result == null)
            {
                return NotFound("Category or Product not found");
            }
            return Ok(result);
        }

        [HttpDelete("product"), Authorize]
        public async Task<ActionResult<Category>> RemoveProductFromCategoryById(Category_Details request)
        {
            var result = await _categoryService.RemoveProductFromCategoryById(request);
            if (result == null)
            {
                return NotFound("Category or Product not found");
            }
            return Ok(result);
        }

        [HttpPut("{id}"), Authorize]
        public async Task<ActionResult<List<Category>>> UpdateCategory(int id, CategoryDTO request)
        {
            var result = await _categoryService.UpdateCategoryById(id, request);
            if (result == null)
            {
                return NotFound("Category not found");
            }
            return Ok(result);
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<ActionResult<List<Category>>> DeleteCategory(int id)
        {
            var result = await _categoryService.DeleteCategoryById(id);
            if (result == null)
            {
                return NotFound("Category not found");
            }
            return Ok(result);
        }

    }
}
