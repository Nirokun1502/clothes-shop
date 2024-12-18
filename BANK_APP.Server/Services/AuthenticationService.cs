using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Caching.Memory;

namespace CLOTHES_SHOP.Server.Services
{
    public class AuthenticationService : IAuthenticationService // có thể thêm nhiều interface ở đây để DI
    {

        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _cache;

        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private Dictionary<string, string> _resetCodes = new Dictionary<string, string>(); // Store reset codes temporarily
        public AuthenticationService(IConfiguration configuration, DataContext context, IHttpContextAccessor httpContextAccessor, IMemoryCache cache)
        {
            _configuration = configuration;
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
        }

       

        public async Task<Account?> Register(AccountDTO request)
        {

            if (request.Username == "" || request.Password == "" ||
                 request.Email == "" || request.First_Name == "" ||
                 request.Last_Name == "" || request.Phone == "")
            {
                return null;
            }

            if (await _context.ACCOUNT.AnyAsync(a => a.Username == request.Username) ||
                await _context.ACCOUNT.AnyAsync(a => a.Email == request.Email) ||
                await _context.ACCOUNT.AnyAsync(a => a.Phone == request.Phone))
            {
                return null;
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);




            Role existedRole = await _context.ROLE.FirstOrDefaultAsync(a => a.Role_Name == "ACTIVE_USER");
            

            Account account = new Account();

            account.Roles = new List<Role>();

            account.Cart = new Cart();

            account.Username = request.Username;
            account.Password = passwordHash;
            account.Email = request.Email;
            account.First_Name = request.First_Name;
            account.Last_Name = request.Last_Name;
            account.Phone = request.Phone;
            account.Create_At = DateTime.Now;


            account.Roles.Add(existedRole);

            _context.ACCOUNT.Add(account);
            await _context.SaveChangesAsync();

            return account;
        }

        public async Task<string?> ChangePassword(ChangePasswordRequestDTO request)
        {
            var account = await _context.ACCOUNT
                .Where(c => c.Username == request.Account.Username)
                .FirstOrDefaultAsync();
            if (account is null ||
               !BCrypt.Net.BCrypt.Verify(request.Account.Password, account.Password))
            {
                return null;
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            account.Password = passwordHash;
            await _context.SaveChangesAsync();
            return "successfully changing password";
        }

        public async Task<string?> Login(AccountDTO request)
        {
            var account = await _context.ACCOUNT
                .Where(c => c.Username == request.Username)
                .Include(c => c.Roles)
                    .ThenInclude(r => r.Permissions)
                .FirstOrDefaultAsync();

            if (account is null ||
               !BCrypt.Net.BCrypt.Verify(request.Password, account.Password))
            {
                return null;
            }

            bool hasLoginPermission = account.Roles
           .SelectMany(r => r.Permissions)
           .Any(p => p.Permission_Name == "LOGIN");

            if (!hasLoginPermission)
            {
                return "1";
            }

            string token = CreateToken(account);

            _httpContextAccessor.HttpContext?.Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true, // Ngăn chặn truy cập từ mã JavaScript
                Secure = true,   // Chỉ gửi qua HTTPS
                SameSite = SameSiteMode.Strict // Ngăn chặn CSRF attacks
            });

            return token;
        }
        public async Task Logout()
        {
            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("access_token");
        }

        public async Task<object?> GetAccountRoleAndPermission()
        {
            if (_httpContextAccessor.HttpContext is null)
            {
                return null;
            }

            var roles = _httpContextAccessor.HttpContext?
                      .User
                      .Claims
                      .Where(c => c.Type == ClaimTypes.Role)
                      .Select(c => c.Value)
                      .ToList();

            var permissions = _httpContextAccessor.HttpContext?
                              .User
                              .Claims
                              .Where(c => c.Type == "Permission")
                              .Select(c => c.Value)
                              .ToList();

            return new { roles, permissions };
        }

        public async Task<object?> GetAccountInfo()
        {
            if (_httpContextAccessor.HttpContext is null)
            {
                return null;
            }

            var userName = _httpContextAccessor.HttpContext?.User?.Identity?.Name;

            var account = await _context.ACCOUNT
                .Where(c => c.Username == userName)
                .Select(account => new
                {
                   AccountId = account.Account_Id,
                   Username = account.Username,
                   Email = account.Email,
                   FirstName = account.First_Name,
                   LastName = account.Last_Name,
                   Phone = account.Phone,
                   DefaultAddressId = account.Default_Address_Id,
                   CartId = account.Cart.Cart_Id
                })
                .FirstOrDefaultAsync();
            
            var roles = _httpContextAccessor.HttpContext?
                        .User
                        .Claims
                        .Where(c => c.Type == ClaimTypes.Role)
                        .Select(c => c.Value)
                        .ToList();

            var permissions = _httpContextAccessor.HttpContext?
                              .User
                              .Claims
                              .Where(c => c.Type == "Permission")
                              .Select(c => c.Value)
                              .ToList();

            return new { account, roles, permissions };
        }

        private string CreateToken(Account account)
        {
            List<Claim> claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, account.Username),
                //new Claim(ClaimTypes.Role, "Admin")       
            };
            if (account.Roles.Any())
            {
                claims.AddRange(account.Roles.Select(role => new Claim(ClaimTypes.Role, role.Role_Name)));
            }
            var permissions = account.Roles
                .SelectMany(role => role.Permissions)
                .Select(permission => permission.Permission_Name)
                .Distinct()
                .ToList();
            if (permissions.Any())
            {
                claims.AddRange(permissions.Select(permission => new Claim("Permission", permission)));
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }



        public async Task<string?> RequestPasswordReset(PasswordResetRequestDTO request)
        {
            var account = await _context.ACCOUNT.FirstOrDefaultAsync(a => a.Email == request.Email);
            if (account is null)
            {
                return null; // Email not found
            }

            string resetCode = GenerateResetCode();
            SetResetCode(request.Email, resetCode);

            // Send reset code to user's email (implementation needed)
            SendResetCodeByEmail(request.Email, resetCode);

            return $"Reset code sent to your email. Current reset code: {_resetCodes.TryGetValue(request.Email, out var reseterCode) } resetcode is:{reseterCode}. All keys: {string.Join(", ", _resetCodes.Keys)}";
        }

        public async Task<string?> ResetPassword(PasswordResetCodeDTO request)
        {
            if (GetResetCode(request.Email) != request.Code)
            {
                return "Invalid reset code";
            }

            var account = await _context.ACCOUNT.FirstOrDefaultAsync(a => a.Email == request.Email);
            if (account is null)
            {
                return null; // Email not found
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            account.Password = passwordHash;

            _context.ACCOUNT.Update(account);
            await _context.SaveChangesAsync();

            _resetCodes.Remove(request.Email); // Remove used reset code

            return "Password successfully reset";
        }

        private string GenerateResetCode()
        {
            return new Random().Next(100000, 999999).ToString(); // Generate a 6-digit code
        }

        private void SendResetCodeByEmail(string email, string resetCode)
        {
            // Set up the email details
            var fromAddress = new MailAddress("clotheshopnguyenquocphi@gmail.com", "Clothes Shop"); // Email này sẽ từ cấu hình của bạn, không cần là Gmail
            var toAddress = new MailAddress(email);
            const string subject = "Password Reset Code";
            string body = $"Your password reset code is: {resetCode}";

            // Configure the SMTP client with Mailtrap settings
            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential("clotheshopnguyenquocphi@gmail.com", "fxdr dwiu rluj mrhp") // Sử dụng thông tin đăng nhập Mailtrap
            };

            // Create the email
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            {
                // Send the email
                smtp.Send(message);
            }
        }

        public void SetResetCode(string email, string code)
        {
            _cache.Set(email, code, TimeSpan.FromMinutes(30)); // Cache for 30 minutes
        }

        public string GetResetCode(string email)
        {
            _cache.TryGetValue(email, out string code);
            return code;
        }

    }
}
