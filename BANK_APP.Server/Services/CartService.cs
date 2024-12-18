using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace CLOTHES_SHOP.Server.Services
{
    public class CartService : ICartService
    {
        private readonly DataContext _context;

        public CartService(DataContext context) 
        {
            _context = context;
        }

        public async Task<List<object>> GetAllCarts()
        {
            var carts = await _context.CART
            .Include(c => c.Account)
            .Include(c => c.Product_Variants)
            .Select(cart => new 
            {
                CartId = cart.Cart_Id,
                Account = cart.Account,
                CartItems = cart.Product_Variants
                .Select(variant => new 
                {
                    Variant = variant,
                    Quantity = _context.CART_DETAILS
                        .Where(cd => cd.Cart_Id == cart.Cart_Id && cd.Variant_Id == variant.Variant_Id)
                        .Select(cd => cd.Quantity)
                        .FirstOrDefault()
                }).ToList()
            }).ToListAsync();

            List<object> result = carts.Cast<object>().ToList();  
            
            return result;
        }

        public async Task<object?> GetCartByAccountId(int id)
        {
            var cart = await _context.CART
                .Where(c => c.Account_Id == id)
                .Include(c => c.Account)
                .Select(cart => new
                {
                    CartId = cart.Cart_Id,
                    cart.Account,
                    CartItems = cart.Product_Variants
                    .Select(variant => new
                    {
                        Variant = variant,
                        ProductName = _context.PRODUCT
                            .Where(p => p.Product_Id == variant.Product_Id)
                            .Select(p => p.Product_Name)
                            .FirstOrDefault(),
                        Quantity = _context.CART_DETAILS
                            .Where(cd => cd.Cart_Id == cart.Cart_Id && cd.Variant_Id == variant.Variant_Id)
                            .Select(cd => cd.Quantity)
                            .FirstOrDefault()
                    })
                .ToList()
                })
                .FirstOrDefaultAsync();

            if (cart == null)
            {
                return null;
            }

            return cart;
        }

        public async Task<Cart?> CreateCartByAccountId(int accountId)
        {
            //check if account and cart already exist
            if (!await _context.ACCOUNT.AnyAsync(a => a.Account_Id == accountId) ||
                 await _context.CART.AnyAsync(c => c.Account_Id == accountId))
            {
                return null;
            }

            Cart cart = new Cart();

            cart.Account_Id = accountId;

            _context.CART.Add(cart);
            await _context.SaveChangesAsync();

            return cart;
        }

        public async Task<List<Cart>?> DeleteCartByAccountId(int accountId)
        {
            // check if cart exist
            var cart = await _context.CART.FindAsync(accountId);
            if (cart == null)
            {
                return null;
            }

            _context.CART.Remove(cart);
            await _context.SaveChangesAsync();

            return await _context.CART.ToListAsync();
        }

        public async Task<Cart?> AddItemToCartByCartId(Cart_Details request)
        {
            var cart = await _context.CART
              .Where(a => a.Cart_Id == request.Cart_Id)
              .Include(a => a.Product_Variants)
              .FirstOrDefaultAsync();

            if (cart == null)
            {
                return null;
            }

            var item = await _context.PRODUCT_VARIANT.FindAsync(request.Variant_Id);
            if (item == null)
            {
                return null;
            }

            var cartItem = await _context.CART_DETAILS
               .Where(c => c.Cart_Id == request.Cart_Id
                   && c.Variant_Id == request.Variant_Id)
               .FirstOrDefaultAsync();

            if (cartItem != null) 
            {
                if (request.Quantity >= 1)
                {cartItem.Quantity += request.Quantity;}
                else
                {cartItem.Quantity += 1; }
                await _context.SaveChangesAsync();

                return cart;
            }


            Cart_Details newItem = new Cart_Details();
            newItem.Cart_Id = request.Cart_Id;
            newItem.Variant_Id = request.Variant_Id;
            newItem.Quantity = request.Quantity;

            _context.CART_DETAILS.Add(newItem);
            await _context.SaveChangesAsync();

            return cart;
        }

        public async Task<Cart_Details?> AdjustCartItemQuantityByCartId(Cart_Details request)
        {
            var cartItem = await _context.CART_DETAILS
               .Where(c => c.Cart_Id == request.Cart_Id 
                && c.Variant_Id == request.Variant_Id)
               .FirstOrDefaultAsync();

            if (cartItem == null || request.Quantity < -cartItem.Quantity)
            {
                return null;
            }

          
            cartItem.Quantity += request.Quantity; 
            await _context.SaveChangesAsync();

            return cartItem;

        }

        public async Task<Cart?> RemoveCartItemByCartId(int cartId, int itemId)
        {
            var cart = await _context.CART
                .Where(a => a.Cart_Id == cartId)
                .Include(a => a.Product_Variants)
                .FirstOrDefaultAsync();

            if(cart == null)
            {
                return null;
            }

            var item = await _context.PRODUCT_VARIANT.FindAsync(itemId);
            if (item == null)
            {
                return null;
            }

            var cartItem = await _context.CART_DETAILS
                .Where(cd => cd.Cart_Id == cartId && cd.Variant_Id == itemId)
                .FirstOrDefaultAsync();

            if (cartItem == null)
            {
                return null;
            }

            _context.CART_DETAILS.Remove(cartItem);
            await _context.SaveChangesAsync();

            return cart;
        }
    }
}
