﻿using Auctionify.Core.Common;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Auctionify.Core.Entities
{
    public class Category : BaseAuditableEntity
    {
        public string Name { get; set; }
    }
}
