using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using MenuManagement.Application.Common.Interfaces;
using MenuManagement.Application.Common.Models;
using MenuManagement.Domain;
using MenuManagement.Application.Features.Objects.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MenuManagement.Application.Features.Objects.Queries
{
    public class GetObjectsPagedQuery : IRequest<OperationResult<PaginatedList<ObjectDto>>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class GetObjectsPagedQueryHandler : IRequestHandler<GetObjectsPagedQuery, OperationResult<PaginatedList<ObjectDto>>>
    {
        private readonly IMenuManagementDbContext _context;
        private readonly IMapper _mapper;

        public GetObjectsPagedQueryHandler(IMenuManagementDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<OperationResult<PaginatedList<ObjectDto>>> Handle(GetObjectsPagedQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Objects.AsNoTracking();

            var count = await query.CountAsync(cancellationToken);
            var data = await query.OrderBy(x => x.Name)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ProjectTo<ObjectDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            var paginatedList = new PaginatedList<ObjectDto>(data, count, request.PageNumber, request.PageSize);
            return OperationResult<PaginatedList<ObjectDto>>.Success(paginatedList);
        }
    }
}
