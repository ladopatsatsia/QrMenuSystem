using System;
using MediatR;
using MenuManagement.Application.Common.Interfaces;
using MenuManagement.Domain;
using MenuManagement.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace MenuManagement.Application.Features.Objects.Commands
{
    public class CreateObjectCommand : IRequest<OperationResult<Guid>>
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class CreateObjectCommandHandler : IRequestHandler<CreateObjectCommand, OperationResult<Guid>>
    {
        private readonly IMenuManagementDbContext _context;

        public CreateObjectCommandHandler(IMenuManagementDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult<Guid>> Handle(CreateObjectCommand request, CancellationToken cancellationToken)
        {
            var entity = new ObjectEntity
            {
                Name = request.Name,
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                Address = request.Address,
                Phone = request.Phone,
                IsActive = request.IsActive
            };

            _context.Objects.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return OperationResult<System.Guid>.Success(entity.Id);
        }
    }
}
