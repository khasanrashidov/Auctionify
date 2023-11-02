﻿using Auctionify.Application.Common.Interfaces;
using Auctionify.Application.Common.Interfaces.Repositories;
using Auctionify.Core.Entities;
using Auctionify.Infrastructure.Common.Options;
using Auctionify.Infrastructure.Identity;
using Auctionify.Infrastructure.Interceptors;
using Auctionify.Infrastructure.Persistence;
using Auctionify.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Auctionify.Infrastructure
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<AuditableEntitySaveChangesInterceptor>();

            // Add DbContext service
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                    builder => builder.EnableRetryOnFailure(maxRetryCount: 5).MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

            services.AddIdentity<User, Role>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
            })
                .AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidAudience = configuration["AuthSettings:Audience"],
                        ValidIssuer = configuration["AuthSettings:Issuer"],
                        RequireExpirationTime = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["AuthSettings:Key"])),
                        ValidateIssuerSigningKey = true
                    };
                });

            var usersSeedingData = configuration.GetSection("UsersSeedingData");
            services.Configure<UsersSeedingData>(usersSeedingData);

            services.AddScoped<ApplicationDbContextInitializer>();

            services.AddScoped<IIdentityService, IdentityService>();
            services.AddTransient<IEmailService, SendGridEmailService>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ILotRepository, LotRepository>();
            services.AddScoped<ILotStatusRepository, LotStatusRepository>();
            services.AddScoped<ICurrencyRepository, CurrencyRepository>();
            services.AddScoped<IBidRepository, BidRepository>();

            return services;
        }
    }
}
