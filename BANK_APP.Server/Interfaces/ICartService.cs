using CLOTHES_SHOP.Server.Model;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface ICartService
    {
        Task<List<object>> GetAllCarts();
        Task<object?> GetCartByAccountId(int id);
        Task<Cart?> CreateCartByAccountId(int accountId);
        Task<List<Cart>?> DeleteCartByAccountId(int accountId);
        Task<Cart?> AddItemToCartByCartId(Cart_Details request);
        Task<Cart_Details?> AdjustCartItemQuantityByCartId(Cart_Details request);
        Task<Cart?> RemoveCartItemByCartId(int cartId, int itemId);
        //Task<Cart?> ClearCartItemByCartId(int cartId);
    }
}
