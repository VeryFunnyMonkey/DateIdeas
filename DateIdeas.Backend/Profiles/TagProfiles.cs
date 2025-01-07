using AutoMapper;
using DateIdeasBackend.Dtos;
using DateIdeasBackend.Models;


namespace DateIdeasBackend.Profiles
{
    public class TagProfiles : Profile
    {
        public TagProfiles()
        {
            CreateMap<Tag, TagDto>();
            CreateMap<CreateTagDto, Tag>();
            CreateMap<UpdateTagDto, Tag>();
        }
    }
}