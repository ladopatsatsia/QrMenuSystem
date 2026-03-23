using AutoMapper;
using MenuManagement.Application.Features.MenuItems.DTOs;
using MenuManagement.Application.Features.Menus.DTOs;
using MenuManagement.Application.Features.Objects.DTOs;
using MenuManagement.Domain.Entities;

namespace MenuManagement.Application.Common.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ObjectEntity, ObjectDto>().ReverseMap();
            CreateMap<MenuEntity, MenuDto>().ReverseMap();
            CreateMap<MenuItemEntity, MenuItemDto>().ReverseMap();
        }
    }
}
