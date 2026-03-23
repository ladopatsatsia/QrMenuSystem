using MediatR;
using MenuManagement.Application.Common.Interfaces;
using MenuManagement.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace MenuManagement.Application.Features.Objects.Commands
{
    public class UpdateObjectCommand : IRequest<OperationResult>
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public bool IsActive { get; set; }
    }

    public class UpdateObjectCommandHandler : IRequestHandler<UpdateObjectCommand, OperationResult>
    {
        private readonly IMenuManagementDbContext _context;

        public UpdateObjectCommandHandler(IMenuManagementDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult> Handle(UpdateObjectCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Objects.FindAsync(new object[] { request.Id }, cancellationToken);

            if (entity == null)
            {
                return OperationResult.Failure("Object not found.");
            }

            entity.Name = request.Name;
            entity.Description = request.Description;
            entity.ImageUrl = request.ImageUrl;
            entity.Address = request.Address;
            entity.Phone = request.Phone;
            entity.IsActive = request.IsActive;

            await _context.SaveChangesAsync(cancellationToken);

            return OperationResult.Success();
        }
    }
}
