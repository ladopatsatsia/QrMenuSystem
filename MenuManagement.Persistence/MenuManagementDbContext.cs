using MenuManagement.Application.Common.Interfaces;
using MenuManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace MenuManagement.Persistence
{
    public class MenuManagementDbContext : DbContext, IMenuManagementDbContext
    {
        public MenuManagementDbContext(DbContextOptions<MenuManagementDbContext> options)
            : base(options)
        {
        }

        public DbSet<ObjectEntity> Objects => Set<ObjectEntity>();
        public DbSet<MenuEntity> Menus => Set<MenuEntity>();
        public DbSet<MenuItemEntity> MenuItems => Set<MenuItemEntity>();
        public DbSet<UserEntity> Users => Set<UserEntity>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
