using System.Collections.Generic;

namespace MenuManagement.Domain.Entities
{
    public class ObjectEntity : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<MenuEntity> Menus { get; set; } = new List<MenuEntity>();
    }
}
