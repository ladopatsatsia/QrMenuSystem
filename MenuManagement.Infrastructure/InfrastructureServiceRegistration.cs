using MenuManagement.Application.Common.Interfaces;
using MenuManagement.Infrastructure.Security;
using Microsoft.Extensions.DependencyInjection;

namespace MenuManagement.Infrastructure
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
        {
            services.AddScoped<IJwtService, JwtService>();
            return services;
        }
    }
}
