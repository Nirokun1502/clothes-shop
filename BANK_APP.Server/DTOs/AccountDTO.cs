using CLOTHES_SHOP.Server.Model;

namespace CLOTHES_SHOP.Server.DTOs
{
    public class AccountDTO
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string First_Name { get; set; } = string.Empty;
        public string Last_Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }

    public class ChangePasswordRequestDTO
    {
        public AccountDTO Account { get; set; } = new AccountDTO();
        public string NewPassword { get; set; } = string.Empty;
    }

    public class PasswordResetRequestDTO
    {
        public string Email { get; set; } = string.Empty;
    }

    public class PasswordResetCodeDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
