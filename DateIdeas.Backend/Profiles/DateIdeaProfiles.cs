using AutoMapper;
using DateIdeasBackend.Dtos;
using DateIdeasBackend.Models;


namespace DateIdeasBackend.Profiles
{
    public class DateIdeaProfiles : Profile
    {
        public DateIdeaProfiles()
        {
            CreateMap<DateIdea, DateIdeaDto>();
            CreateMap<CreateDateIdeaDto, DateIdea>();
            CreateMap<UpdateDateIdeaDto, DateIdea>();
        }
    }
}