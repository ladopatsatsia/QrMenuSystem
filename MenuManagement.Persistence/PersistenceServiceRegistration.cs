using MenuManagement.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MenuManagement.Persistence
{
    public static class PersistenceServiceRegistration
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            var postgresConn = configuration.GetConnectionString("PostgresConnection") ?? Environment.GetEnvironmentVariable("DATABASE_URL");
            
            services.AddDbContext<MenuManagementDbContext>(options =>
            {
                if (!string.IsNullOrEmpty(postgresConn))
                {
                    options.UseNpgsql(postgresConn);
                }
                else
                {
                    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                        b => b.MigrationsAssembly(typeof(MenuManagementDbContext).Assembly.FullName)
                              .EnableRetryOnFailure());
                }
            });

            services.AddScoped<IMenuManagementDbContext>(provider => provider.GetRequiredService<MenuManagementDbContext>());

            return services;
        }
    }
}
