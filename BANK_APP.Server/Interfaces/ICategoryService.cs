using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Model;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface ICategoryService
    {
        Task<List<object>> GetAllCategories();
        Task<Category?> GetCategoryById(int id);
        Task<Category?> GetCategoryByName(string categoryname);
        Task<Category?> AddCategory(CategoryDTO request);
        Task<Category?> UpdateCategoryById(int id, CategoryDTO request);
        Task<List<Category>?> DeleteCategoryById(int id);
        Task<Category?> AddProductToCategoryById(Category_Details request);
        Task<Category?> RemoveProductFromCategoryById(Category_Details request);
    }
}
