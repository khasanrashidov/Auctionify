﻿using Auctionify.Core.Entities;
using System.ComponentModel.DataAnnotations;

namespace Auctionify.Application.Common.Models.Account
{
    public class AssignRoleToUserViewModel
    {
        public string Token { get; set; }
        public string Role { get; set; }
    }
}
