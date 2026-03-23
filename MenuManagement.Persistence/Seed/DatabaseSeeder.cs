using MenuManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MenuManagement.Persistence.Seed
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(MenuManagementDbContext context)
        {
            if (!context.Users.Any())
            {
                var admin = new UserEntity
                {
                    Username = "admin",
                    PasswordHash = "admin123", // For demo
                    Role = "Admin"
                };
                context.Users.Add(admin);
            }

            if (!context.Objects.Any())
            {
                var obj1 = new ObjectEntity
                {
                    Name = "Sample Restaurant 1",
                    Description = "Modern Italian Cuisine",
                    Address = "123 Pasta St",
                    Phone = "555-0101",
                    ImageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                };

                var obj2 = new ObjectEntity
                {
                    Name = "Sample Cafe 2",
                    Description = "Artisan Coffee & Bakery",
                    Address = "456 Bean Blvd",
                    Phone = "555-0202",
                    ImageUrl = "https://images.unsplash.com/photo-1554118811-1e0d58224f24"
                };

                context.Objects.AddRange(obj1, obj2);

                var menu1 = new MenuEntity
                {
                    ObjectId = obj1.Id,
                    Name = "Lunch Menu",
                    Description = "Available 11 AM - 4 PM",
                    SortOrder = 1
                };

                var menu2 = new MenuEntity
                {
                    ObjectId = obj1.Id,
                    Name = "Dinner Menu",
                    Description = "Available 5 PM - 10 PM",
                    SortOrder = 2
                };

                context.Menus.AddRange(menu1, menu2);

                var item1 = new MenuItemEntity
                {
                    MenuId = menu1.Id,
                    Name = "Carbonara",
                    Description = "Classic pasta with egg, cheese, and guanciale",
                    Price = 14.99m,
                    SortOrder = 1
                };

                var item2 = new MenuItemEntity
                {
                    MenuId = menu1.Id,
                    Name = "Margherita Pizza",
                    Description = "Tomato, mozzarella, and basil",
                    Price = 12.99m,
                    SortOrder = 2
                };

                context.MenuItems.AddRange(item1, item2);
            }

            await context.SaveChangesAsync();
        }
    }
}
