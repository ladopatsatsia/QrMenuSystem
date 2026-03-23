using MediatR;
using MenuManagement.Application.Common.Interfaces;
using MenuManagement.Domain;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace MenuManagement.Application.Features.Objects.Commands
{
    public class DeleteObjectCommand : IRequest<OperationResult>
    {
        public Guid Id { get; set; }
    }

    public class DeleteObjectCommandHandler : IRequestHandler<DeleteObjectCommand, OperationResult>
    {
        private readonly IMenuManagementDbContext _context;

        public DeleteObjectCommandHandler(IMenuManagementDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult> Handle(DeleteObjectCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Objects.FindAsync(new object[] { request.Id }, cancellationToken);

            if (entity == null)
            {
                return OperationResult.Failure("Object not found.");
            }

            _context.Objects.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return OperationResult.Success();
        }
    }
}
