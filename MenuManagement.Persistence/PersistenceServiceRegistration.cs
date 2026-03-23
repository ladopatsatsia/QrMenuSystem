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
            var rawConnection = configuration.GetConnectionString("PostgresConnection") ?? Environment.GetEnvironmentVariable("DATABASE_URL");
            var connectionString = ConvertPostgresUriToConnectionString(rawConnection);
            
            services.AddDbContext<MenuManagementDbContext>(options =>
            {
                if (!string.IsNullOrEmpty(connectionString))
                {
                    options.UseNpgsql(connectionString);
                }
                else
                {
                    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                        b => b.MigrationsAssembly(typeof(MenuManagementDbContext).Assembly.FullName)
                              .EnableRetryOnFailure());
                }
            });

            services.AddScoped<IMenuManagementDbContext>(provider => provider.GetRequiredService<MenuManagementDbContext>());

            return services;
        }

        private static string? ConvertPostgresUriToConnectionString(string? uri)
        {
            if (string.IsNullOrEmpty(uri) || !uri.StartsWith("postgresql://")) 
                return uri;

            try
            {
                var databaseUri = new Uri(uri);
                var userInfo = databaseUri.UserInfo.Split(':');

                var username = userInfo[0];
                var password = userInfo.Length > 1 ? userInfo[1] : "";
                var host = databaseUri.Host;
                var port = databaseUri.Port == -1 ? 5432 : databaseUri.Port;
                var database = databaseUri.AbsolutePath.TrimStart('/');

                return $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
            }
            catch
            {
                // Fallback to original if parsing fails
                return uri;
            }
        }
    }
}
