using System;
using MediatR;
using MenuManagement.Application.Common.Interfaces;
using MenuManagement.Domain;
using MenuManagement.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace MenuManagement.Application.Features.MenuItems.Commands
{
    public class CreateMenuItemCommand : IRequest<OperationResult<Guid>>
    {
        public Guid MenuId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public int SortOrder { get; set; }
        public bool IsAvailable { get; set; } = true;
    }

    public class CreateMenuItemCommandHandler : IRequestHandler<CreateMenuItemCommand, OperationResult<Guid>>
    {
        private readonly IMenuManagementDbContext _context;

        public CreateMenuItemCommandHandler(IMenuManagementDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult<Guid>> Handle(CreateMenuItemCommand request, CancellationToken cancellationToken)
        {
            var parentMenu = await _context.Menus.FindAsync(new object[] { request.MenuId }, cancellationToken);
            if (parentMenu == null)
            {
                return OperationResult<Guid>.Failure("Menu not found.");
            }

            var entity = new MenuItemEntity
            {
                MenuId = request.MenuId,
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                ImageUrl = request.ImageUrl,
                SortOrder = request.SortOrder,
                IsAvailable = request.IsAvailable
            };

            _context.MenuItems.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return OperationResult<Guid>.Success(entity.Id);
        }
    }
}
