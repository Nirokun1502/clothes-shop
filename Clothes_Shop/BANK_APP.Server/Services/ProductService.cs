using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace CLOTHES_SHOP.Server.Services
{
    public class ProductService : IProductService
    {
        private readonly DataContext _context;

        public ProductService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetAllProducts()
        {
            var products = await _context.PRODUCT
            .Include(c => c.Product_Variants)
            .Select(product => new
            {
                Id = product.Product_Id,
                ProductName = product.Product_Name,
                ProductImage = product.Image,
                ProductDescription = product.Description,
                Active = product.Is_Active,
                SoldQuantity = product.Sold_Quantity,
                CreatedAt = product.Create_At,
                Variants = product.Product_Variants.Select(
                    variant => new 
                    {   
                        VariantId = variant.Variant_Id,
                        VariantName = variant.Variant_Name,
                        Price = variant.Price,
                        InStock = variant.In_Stock,
                        SoldQuantity = variant.Sold_Quantity,
                        VariantImage = variant.Image,
                    }).ToList(),
                Categories = product.Categories.Select(category => category.Category_Name)
            })
            .ToListAsync();

            List<object> result = products.Cast<object>().ToList();

            return result;
        }

        public async Task<Product?> GetAllVariantsByProductId(int id)
        {
            var product = await _context.PRODUCT
                .Where(c => c.Product_Id == id)
                .Include(c => c.Product_Variants)
                .FirstOrDefaultAsync();


            if (product == null)
            {
                return null;
            }
            return product;
        }

        public async Task<Product?> AddProduct(ProductDTO request)
        {
            if (request.Product_Name == "" || request.Image == "" ||
                request.Description == "" )
            {
                return null;
            }

            //check repeat product name
            if ( await _context.PRODUCT.AnyAsync(a => a.Product_Name == request.Product_Name))
            {
                return null;
            }

            Product product = new Product();

            product.Product_Name = request.Product_Name;
            product.Image = request.Image;
            product.Description = request.Description;
            product.Is_Active = request.Is_Active;
            product.Sold_Quantity = 0;
            product.Create_At = DateTime.Now;
           
            _context.PRODUCT.Add(product);
            await _context.SaveChangesAsync();

            return product;
               
        }

        public async Task<Product_Variant?> AddVariantByProductId(int productId, ProductVariantDTO request)
        {
            if (request.Variant_Name == "" || request.Price <=0 || 
                request.Image == "" || request.In_Stock < 0)
            {
                return null;
            }

            // check if product exist
            if (!await _context.PRODUCT.AnyAsync(a => a.Product_Id == productId))
            {
                return null;
            }

            Product_Variant variant = new Product_Variant();
            variant.Product_Id = productId;
            variant.Variant_Name = request.Variant_Name;
            variant.Price = request.Price;
            variant.In_Stock = request.In_Stock;
            variant.Sold_Quantity = 0;
            variant.Image = request.Image;

            _context.PRODUCT_VARIANT.Add(variant);
            await _context.SaveChangesAsync();

            return variant;
        }

        public async Task<Product?> UpdateProductById(int id, ProductDTO request)
        {
            if (request.Product_Name == "" || request.Image == "" ||
                request.Description == "" || request.Sold_Quantity <0)
            {
                return null;
            }

            // check if product exist
            var product = await _context.PRODUCT.FindAsync(id);
            if (product == null)
            {
                return null;
            }

            product.Product_Name = request.Product_Name;
            product.Image = request.Image;
            product.Description = request.Description;
            product.Is_Active = request.Is_Active;
            product.Sold_Quantity = request.Sold_Quantity;
            
            
            await _context.SaveChangesAsync();

            return product;

        }

        public async Task<Product_Variant?> UpdateVariantById(int id, ProductVariantDTO request)
        {
            

            // check if variant exist
            var variant = await _context.PRODUCT_VARIANT.FindAsync(id);
            if (variant == null)
            {
                return null;
            }

            //variant.Variant_Name = request.Variant_Name;
            //variant.Image = request.Image;
            //variant.Price = request.Price;
            variant.In_Stock = variant.In_Stock -  request.In_Stock;
            variant.Sold_Quantity = variant.Sold_Quantity + request.Sold_Quantity;

            

            await _context.SaveChangesAsync();

            return variant;
        }

        public async Task<List<Product>?> DeleteProductById(int id)
        {
            // check if product exist
            var product = await _context.PRODUCT.FindAsync(id);
            if (product == null)
            {
                return null;
            }

            _context.PRODUCT.Remove(product);
            await _context.SaveChangesAsync();

            return await _context.PRODUCT.ToListAsync();
        }

        public async Task<Product?> DeleteVariantById(int id)
        {
            // check if variant exist
            var variant = await _context.PRODUCT_VARIANT.FindAsync(id);
            if (variant == null)
            {
                return null;
            }

            _context.PRODUCT_VARIANT.Remove(variant);
            await _context.SaveChangesAsync();

            return await _context.PRODUCT.FindAsync(variant.Product_Id);
        }

        public async Task<List<object>> SearchProduct(string productName)
        {
            // Tìm kiếm các sản phẩm có tên chứa chuỗi productName (không phân biệt chữ hoa chữ thường)
            var products = await _context.PRODUCT
                .Where(p => p.Product_Name.Contains(productName))
                .Select(p => new
                {
                    p.Product_Id,
                    p.Product_Name,
                })
                .ToListAsync();

            return products.Cast<object>().ToList();
        }

    }
}
