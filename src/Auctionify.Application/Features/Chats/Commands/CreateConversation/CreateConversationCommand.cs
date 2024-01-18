﻿using Auctionify.Application.Common.Interfaces;
using Auctionify.Application.Common.Interfaces.Repositories;
using Auctionify.Core.Entities;
using Auctionify.Core.Enums;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Auctionify.Application.Features.Chats.Commands.CreateConversation
{
	public class CreateConversationCommand : IRequest<CreatedConversationResponse>
	{
		public int LotId { get; set; }
	}

	public class CreateConversationCommandHandler
		: IRequestHandler<CreateConversationCommand, CreatedConversationResponse>
	{
		private readonly IMapper _mapper;
		private readonly ILotRepository _lotRepository;
		private readonly IConversationRepository _conversationRepository;
		private readonly ICurrentUserService _currentUserService;
		private readonly UserManager<User> _userManager;

		public CreateConversationCommandHandler(
			IMapper mapper,
			ILotRepository lotRepository,
			IConversationRepository conversationRepository,
			ICurrentUserService currentUserService,
			UserManager<User> userManager
		)
		{
			_mapper = mapper;
			_lotRepository = lotRepository;
			_conversationRepository = conversationRepository;
			_currentUserService = currentUserService;
			_userManager = userManager;
		}

		public async Task<CreatedConversationResponse> Handle(
			CreateConversationCommand request,
			CancellationToken cancellationToken
		)
		{
			var currentUser = await _userManager.FindByEmailAsync(_currentUserService.UserEmail!);

			var currentUserRole = (UserRole)
				Enum.Parse(
					typeof(UserRole),
					(await _userManager.GetRolesAsync(currentUser!)).FirstOrDefault()!
				);

			var lot = await _lotRepository.GetAsync(
				predicate: l => l.Id == request.LotId,
				cancellationToken: cancellationToken
			);

			var sellerId = currentUserRole == UserRole.Seller ? currentUser!.Id : lot!.SellerId;
			var buyerId = currentUserRole == UserRole.Buyer ? currentUser!.Id : lot!.BuyerId;

			#region If there is already a conversation between the buyer and the seller for this lot, return it
			var existingConversation = await _conversationRepository.GetAsync(
				predicate: c =>
					c.LotId == request.LotId && c.BuyerId == buyerId && c.SellerId == sellerId,
				cancellationToken: cancellationToken
			);

			if (existingConversation != null)
			{
				return _mapper.Map<CreatedConversationResponse>(existingConversation);
			}

			#endregion

			var conversation = new Conversation
			{
				BuyerId = (int)buyerId!, // because the BuyerId in Lot is nullable
				SellerId = sellerId,
				LotId = request.LotId
			};

			var result = await _conversationRepository.AddAsync(conversation);

			return _mapper.Map<CreatedConversationResponse>(result);
		}
	}
}
