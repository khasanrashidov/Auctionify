﻿using Auctionify.Application.Common.Interfaces.Repositories;
using Auctionify.Core.Enums;
using FluentValidation;

namespace Auctionify.Application.Features.Rates.Commands.AddRateToSeller
{
	public class AddRateToSellerCommandValidator : AbstractValidator<AddRateToSellerCommand>
	{
		private readonly IRateRepository _rateRepository;
		private readonly ILotRepository _lotRepository;
		private readonly ILotStatusRepository _lotStatusRepository;

		public AddRateToSellerCommandValidator(
			IRateRepository rateRepository,
			ILotRepository lotRepository,
			ILotStatusRepository lotStatusRepository
		)
		{
			_rateRepository = rateRepository;
			_lotRepository = lotRepository;
			_lotStatusRepository = lotStatusRepository;

			ClassLevelCascadeMode = CascadeMode.Stop;

			RuleFor(x => x.LotId)
				.Cascade(CascadeMode.Stop)
				.MustAsync(
					async (lotId, cancellationToken) =>
					{
						var lot = await _lotRepository.GetAsync(
							predicate: x => x.Id == lotId,
							cancellationToken: cancellationToken
						);

						var lotStatus = await _lotStatusRepository.GetAsync(
							predicate: x => x.Name == AuctionStatus.Sold.ToString(),
							cancellationToken: cancellationToken
						);

						if (lot is not null && lotStatus is not null)
						{
							return lot.LotStatusId == lotStatus.Id;
						}

						return false;
					}
				)
				.WithMessage("You can rate if the lot is sold to you")
				.OverridePropertyName("LotId")
				.WithName("Lot Id");

			RuleFor(x => x)
				.Cascade(CascadeMode.Stop)
				.MustAsync(
					async (request, cancellationToken) =>
					{
						var lot = await _lotRepository.GetAsync(
							predicate: x => x.Id == request.LotId,
							cancellationToken: cancellationToken
						);

						if (lot.BuyerId is not null)
						{
							var ratings = await _rateRepository.GetListAsync(
								predicate: l => l.LotId == request.LotId,
								cancellationToken: cancellationToken
							);

							if (ratings.Items.Count < 2)
							{
								if (!ratings.Items.Any(item => item.SenderId == lot.SellerId))
								{
									return true;
								}
							}
						}

						return false;
					}
				)
				.WithMessage("You have already rate")
				.OverridePropertyName("Rate")
				.WithName("Rate");
		}
	}
}
