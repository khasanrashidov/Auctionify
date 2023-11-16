using Auctionify.Application.Common.Interfaces;
using Auctionify.Application.Common.Models.Account;
using Auctionify.Core.Entities;
using Microsoft.AspNetCore.Http;
using Auctionify.Infrastructure.Common.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Dynamic.Core.Tokenizer;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using static Google.Apis.Auth.GoogleJsonWebSignature;
using Microsoft.Extensions.Configuration;

namespace Auctionify.Infrastructure.Identity
{
    /// <summary>
    /// Concrete implementation of IIdentityService
    /// </summary>
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ILogger<IdentityService> _logger;
        private readonly IEmailService _emailService;
        private readonly RoleManager<Role> _roleManager;
        private readonly AuthSettingsOptions _authSettingsOptions;
        private readonly AppOptions _appOptions;
        private readonly IConfiguration _configuration;

        public IdentityService(
            SignInManager<User> signInManager,
            UserManager<User> userManager,
            ILogger<IdentityService> logger,
            IConfiguration configuration,
            IEmailService emailService,
            RoleManager<Role> roleManager,
            IOptions<AuthSettingsOptions> authSettingsOptions,
            IOptions<AppOptions> appOptions
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _emailService = emailService;
            _roleManager = roleManager;
            _authSettingsOptions = authSettingsOptions.Value;
            _appOptions = appOptions.Value;
        }

        public async Task<LoginResponse> LoginUserAsync(LoginViewModel userModel)
        {
            if (
                userModel is null
                || string.IsNullOrEmpty(userModel.Email)
                || string.IsNullOrEmpty(userModel.Password)
            )
            {
                return new LoginResponse
                {
                    Errors = new[] { "User data is emtpy" },
                    IsSuccess = false,
                };
            }
            var user = await _userManager.FindByEmailAsync(userModel.Email);

            if (user is null)
            {
                return new LoginResponse
                {
                    Errors = new[] { "User is not found" },
                    IsSuccess = false,
                };
            }

            var result = await _signInManager.PasswordSignInAsync(
                user,
                userModel.Password,
                false,
                false
            );

            if (result.Succeeded)
            {
                _logger.LogInformation("User logged in");
            }
            else
            {
                return new LoginResponse
                {
                    Errors = new[] { "Wrong password or email" },
                    IsSuccess = false,
                };
            }

            if (!user.EmailConfirmed)
            {
                return new LoginResponse
                {
                    Errors = new[] { "User is not active" },
                    IsSuccess = false,
                };
            }

            var token = await GenerateJWTTokenWithUserClaimsAsync(user);

            token.Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault()!;

            return new LoginResponse { IsSuccess = true, Result = token };
        }

        /// <summary>
        /// Generation of JWT token with User claims including Email and role
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        private async Task<TokenModel> GenerateJWTTokenWithUserClaimsAsync(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim> { new Claim(ClaimTypes.Email, user.Email!), };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authSettingsOptions.Key));

            var token = new JwtSecurityToken(
                issuer: _authSettingsOptions.Issuer,
                audience: _authSettingsOptions.Audience,
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            string tokenAsString = new JwtSecurityTokenHandler().WriteToken(token);

            return new TokenModel { AccessToken = tokenAsString, ExpireDate = token.ValidTo };
        }

        public async Task<ResetPasswordResponse> ForgetPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user is null)
            {
                return new ResetPasswordResponse
                {
                    IsSuccess = false,
                    Message = "No user associated with email"
                };
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var encodedToken = Encoding.UTF8.GetBytes(token);
            var validToken = WebEncoders.Base64UrlEncode(encodedToken);

            string url = $"{_appOptions.Url}/reset-password?email={email}&token={validToken}";

            await _emailService.SendEmailAsync(
                email,
                "Reset Password",
                "<h1>Follow the instructions to reset your password</h1>"
                    + $"<p>To reset your password <a href='{url}'>Click here</p> <br>"
                    + $"<p> Token: {token}</p>"
            );

            return new ResetPasswordResponse
            {
                IsSuccess = true,
                Message = "Reset password URL has been sent to the email successfully"
            };
        }

        public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user is null)
            {
                return new ResetPasswordResponse
                {
                    IsSuccess = false,
                    Message = "No user associated with email"
                };
            }

            if (model.NewPassword != model.ConfirmPassword)
                return new ResetPasswordResponse
                {
                    IsSuccess = false,
                    Message = "Password does not match its confirmation"
                };

            var decodedToken = WebEncoders.Base64UrlDecode(model.Token);
            string normalToken = Encoding.UTF8.GetString(decodedToken);

            var result = await _userManager.ResetPasswordAsync(
                user,
                normalToken,
                model.NewPassword
            );

            if (result.Succeeded)
                return new ResetPasswordResponse
                {
                    Message = "Password has been reset successfully!",
                    IsSuccess = true
                };

            return new ResetPasswordResponse
            {
                Message = "Something went wrong",
                IsSuccess = false,
                Errors = result.Errors.Select(e => e.Description)
            };
        }

        public async Task<RegisterResponse> RegisterUserAsync(RegisterViewModel model)
        {
            if (model is null)
                throw new NullReferenceException("Register Model is null")!;

            if (model.Password != model.ConfirmPassword)
                return new RegisterResponse
                {
                    Message = "Confirm password doesn't match the password",
                    IsSuccess = false,
                };

            var user = new User { Email = model.Email, UserName = model.Email, };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                var confirmEmailToken = await _userManager.GenerateEmailConfirmationTokenAsync(
                    user
                );

                var encodedEmailToken = Encoding.UTF8.GetBytes(confirmEmailToken);
                var validEmailToken = WebEncoders.Base64UrlEncode(encodedEmailToken);

                var url =
                    $"{_appOptions.Url}/api/auth/confirm-email?userid={user.Id}&token={validEmailToken}";

                await _emailService.SendEmailAsync(
                    user.Email,
                    "Confirm your email",
                    $"<h1>Welcome to Auctionify</h1>"
                        + $"<p>Please confirm your email by <a href='{url}'>clicking here</a></p>"
                );

                return new RegisterResponse
                {
                    Message = "User created successfully!",
                    IsSuccess = true,
                };
            }

            return new RegisterResponse
            {
                Message = "User was not created",
                IsSuccess = false,
                Errors = result.Errors.Select(e => e.Description),
            };
        }

        public async Task<RegisterResponse> ConfirmUserEmailAsync(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user is null)
                return new RegisterResponse { IsSuccess = false, Message = "User not found", };

            var decodedToken = WebEncoders.Base64UrlDecode(token);
            string normalToken = Encoding.UTF8.GetString(decodedToken);

            var result = await _userManager.ConfirmEmailAsync(user, normalToken);

            if (result.Succeeded)
                return new RegisterResponse
                {
                    Message = "Email confirmed successfully!",
                    IsSuccess = true,
                };

            return new RegisterResponse
            {
                Message = "Email did not confirm",
                IsSuccess = false,
                Errors = result.Errors.Select(e => e.Description),
            };
        }

        public async Task<AssignRoleToUserResponse> AssignRoleToUserAsync(AssignRoleToUserViewModel model)
        {
            var userEmail = await DecodeTokenAndGetUser(model.Token);

            if (string.IsNullOrWhiteSpace(userEmail.ToString()))
            {
                return new AssignRoleToUserResponse
                {
                    IsSuccess = false,
                    Message = "Invalid or expired token"
                };
            }

            if (string.IsNullOrWhiteSpace(model.Role))
            {
                return new AssignRoleToUserResponse
                {
                    IsSuccess = false,
                    Message = "Role name is not provided"
                };
            }

            var roleExists = await _roleManager.RoleExistsAsync(model.Role);

            if (!roleExists)
            {
                return new AssignRoleToUserResponse
                {
                    IsSuccess = false,
                    Message = "Role not found"
                };
            }

            var user = await _userManager.FindByEmailAsync(userEmail.ToString());

            if (user == null)
            {
                return new AssignRoleToUserResponse
                {
                    IsSuccess = false,
                    Message = "User not found"
                };
            }

            var userHasRole = await _userManager.IsInRoleAsync(user, model.Role);

            if (userHasRole)
            {
                return new AssignRoleToUserResponse
                {
                    IsSuccess = false,
                    Message = "User already has the specified role"
                };
            }

            var result = await _userManager.AddToRoleAsync(user, model.Role);

            if (result.Succeeded)
            {
                return new AssignRoleToUserResponse
                {
                    IsSuccess = true,
                    Message = $"Role '{model.Role}' assigned to the user successfully"
                };
            }
            else
            {
                return new AssignRoleToUserResponse
                {
                    IsSuccess = false,
                    Message = "Failed to assign role",
                    Errors = result.Errors.Select(e => e.Description)
                };
            }
        }

        private async Task<User> DecodeTokenAndGetUser(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AuthSettings:Key"]));
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _configuration["AuthSettings:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["AuthSettings:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out _);

            var userId = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (userId != null)
            {
                var user = await _userManager.FindByEmailAsync(userId);
                return user;
            }
            else
            {
                return new User();
            }
        }
        
        public async Task<LoginResponse> LoginUserWithGoogleAsync(Payload payload)
        {
            var user = await _userManager.FindByEmailAsync(payload.Email);
            if (user == null)
            {
                user = new User
                {
                    Email = payload.Email,
                    UserName = payload.Email,
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName,
                    EmailConfirmed = true
                };

                var createdResult = await _userManager.CreateAsync(user);
                if (!createdResult.Succeeded)
                {
                    return new LoginResponse
                    {
                        IsSuccess = false,
                        Errors = createdResult.Errors.Select(e => e.Description)
                    };
                }
            }

            var token = await GenerateJWTTokenWithUserClaimsAsync(user);

            var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();

            if (role == null)
            {
                token.Role = string.Empty;
            }

            return new LoginResponse { IsSuccess = true, Result = token };
        }
    }
}
