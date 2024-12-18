using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using CLOTHES_SHOP.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace CLOTHES_SHOP.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet(Name = "GetAllProducts")]
        public async Task<ActionResult<List<object>>> GetAllProducts() 
        {
            var result = await _productService.GetAllProducts();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetAllVariantsByProductId(int id)
        {
            var result = await _productService.GetAllVariantsByProductId(id);
            if (result == null)
            {
                return NotFound("Product not found");
            }

            return Ok(result);
        }

        [HttpGet("search/{productName}", Name = "SearchProduct")]
        public async Task<ActionResult<List<object>>> SearchProduct(string productName)
        {
            var result = await _productService.SearchProduct(productName);
            if (result == null)
            {
                return NotFound("Product not found");
            }

            return Ok(result);
        }


        [HttpPost("Product",Name ="AddProduct"), Authorize]
        public async Task<ActionResult<Product>> AddProduct(ProductDTO product)
        {
            var result = await _productService.AddProduct(product);
            return Ok(result);
        }

        [HttpPost("Variant",Name = "AddVariant"), Authorize]
        public async Task<ActionResult<Product_Variant>> AddVariantByProductId(int productId, ProductVariantDTO variant)
        {
            var result = await _productService.AddVariantByProductId(productId, variant);
            return Ok(result);
        }

        [HttpPut("Product",Name = "UpdateProduct"), Authorize]
        public async Task<ActionResult<Product>> UpdateProduct(int id, ProductDTO product)
        {
            var result = await _productService.UpdateProductById(id, product);
            if (result == null)
            {
                return NotFound("Product not found");
            }
            return Ok(result);
        }

        [HttpPut("Variant",Name = "UpdateVariant"), Authorize]
        public async Task<ActionResult<Product_Variant>> UpdateVariant(int id, ProductVariantDTO variant)
        {
            var result = await _productService.UpdateVariantById(id, variant);
            if (result == null)
            {
                return NotFound("Variant not found");
            }
            return Ok(result);
        }

        [HttpDelete("Product",Name = "DeleteProduct"), Authorize]
        public async Task<ActionResult<List<Product>>> DeleteProduct(int id)
        {
            var result = await _productService.DeleteProductById(id);
            if (result == null)
            {
                return NotFound("Product not found");
            }
            return Ok(result);
        }

        [HttpDelete("Variant",Name = "DeleteVariant"), Authorize]
        public async Task<ActionResult<Product>> DeleteVariant(int id)
        {
            var result = await _productService.DeleteVariantById(id);
            if (result == null)
            {
                return NotFound("Variant not found");
            }
            return Ok(result);
        }

    }
}
