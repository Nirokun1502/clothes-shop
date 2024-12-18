using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace CLOTHES_SHOP.Server.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly DataContext _context;

        public CategoryService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetAllCategories()
        {
            var categories = await _context.CATEGORY
           .Include(c => c.Products)
           .ThenInclude(r => r.Product_Variants)
           .Select(category => new
           {
               Id = category.Category_Id,
               Categoryname = category.Category_Name,
               Categoryimage = category.Image,
               Categorydescription = category.Description,
               Categoryproducts = category.Products.Select(product => product.Product_Name).ToList(),
               Categoryproductvariants = category.Products.SelectMany(product => product.Product_Variants.Select(variant => variant.Variant_Name)).ToList()
           })
           .ToListAsync();

            List<object> result = categories.Cast<object>().ToList();

            return result;
        }

        public async Task<Category?> GetCategoryById(int id)
        {
            var category = await _context.CATEGORY
                .Where(c => c.Category_Id == id)
                .Include(c => c.Products)
                .ThenInclude(product => product.Product_Variants)
                .FirstOrDefaultAsync();


            if (category == null)
            {
                return null;
            }
            return category;
        }

        public async Task<Category?> GetCategoryByName(string categoryname)
        {
            var category = await _context.CATEGORY
                .Where(c => c.Category_Name == categoryname)
                .Include(c => c.Products)
                .ThenInclude(product => product.Product_Variants)
                .FirstOrDefaultAsync();

            if (category == null)
            {
                return null;
            }
            return category;
        }

        public async Task<Category?> AddCategory(CategoryDTO request)
        {
            if (request.Category_Name == "" || request.Image == "" ||
                request.Description == "" )
            {
                return null;
            }

            if (await _context.CATEGORY.AnyAsync(a => a.Category_Name == request.Category_Name))
            {
                return null;
            }

            Category category = new Category();
            category.Category_Name = request.Category_Name;
            category.Image = request.Image;
            category.Description = request.Description;

          

            _context.CATEGORY.Add(category);
            await _context.SaveChangesAsync();

            return category;
        }

        public async Task<Category?> AddProductToCategoryById(Category_Details request)
        {
            var category = await _context.CATEGORY
                .Where(a => a.Category_Id == request.Category_Id)
                .Include(a => a.Products)
                .FirstOrDefaultAsync();

            if (category == null)
            {
                return null;
            }

            var product = await _context.PRODUCT.FindAsync(request.Product_Id);
            if (product == null)
            {
                return null;
            }



            category.Products.Add(product);
            await _context.SaveChangesAsync();

            return category;
        }

        public async Task<Category?> RemoveProductFromCategoryById(Category_Details request)
        {
            var category = await _context.CATEGORY
                .Where(a => a.Category_Id == request.Category_Id)
                .Include(a => a.Products)
                .FirstOrDefaultAsync();

            if (category == null)
            {
                return null;
            }

            var product = await _context.PRODUCT.FindAsync(request.Product_Id);

            if (product == null)
            {
                return null;
            }



            category.Products.Remove(product);
            await _context.SaveChangesAsync();

            return category;
        }

        public async Task<Category?> UpdateCategoryById(int id, CategoryDTO request) 
        {
            var category = await _context.CATEGORY.FindAsync(id);
            if (category == null)
            {
                return null;
            }

            category.Category_Name = request.Category_Name;
            category.Image = request.Image;
            category.Description = request.Description;
            await _context.SaveChangesAsync();


            return category;
        }

        public async Task<List<Category>?> DeleteCategoryById(int id)
        {
            var category = await _context.CATEGORY.FindAsync(id);
            if (category == null)
            {
                return null;
            }

            _context.CATEGORY.Remove(category);
            await _context.SaveChangesAsync();

            return await _context.CATEGORY.ToListAsync();
        }

    }
}
