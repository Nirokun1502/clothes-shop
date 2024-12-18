using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Model;

namespace CLOTHES_SHOP.Server.Interfaces
{
    public interface IAuthenticationService
    {
        Task<Account?> Register(AccountDTO request);
        Task<string?> ChangePassword(ChangePasswordRequestDTO request);
        Task<string?> Login(AccountDTO request);
        Task Logout();
        Task<object?> GetAccountRoleAndPermission();
        Task<object?> GetAccountInfo();

        Task<string?> RequestPasswordReset(PasswordResetRequestDTO request);
        Task<string?> ResetPassword(PasswordResetCodeDTO request);


    }
}
