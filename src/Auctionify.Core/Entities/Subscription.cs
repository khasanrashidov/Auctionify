﻿using Auctionify.Core.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Auctionify.Core.Entities
{
    internal class Subscription : BaseAuditableEntity
    {
        public int Id { get; set; }

        public SubscriptionType SubscriptionType { get; set; }

        public bool IsActive { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }
}
