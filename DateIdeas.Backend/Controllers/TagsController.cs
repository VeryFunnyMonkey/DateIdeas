using DateIdeasBackend.Data;
using DateIdeasBackend.Dtos;
using DateIdeasBackend.Models;
using DateIdeasBackend.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace DateIdeasBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly DateIdeasContext _context;
        private readonly IMapper _mapper;
        private readonly IHubContext<DateIdeasHub> _hubContext;


        public TagsController(DateIdeasContext context, IMapper mapper, IHubContext<DateIdeasHub> hubContext)
        {
            _context = context;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        // GET: api/Tags
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetTags()
        {
            var tags = await _context.Tags.ToListAsync();
            var tagDtos = _mapper.Map<IEnumerable<TagDto>>(tags);
            return Ok(tagDtos);

        }

        // GET: api/Tags/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TagDto>> GetTag(int id)
        {
            var tag = await _context.Tags.Include(t => t.DateIdeas).FirstOrDefaultAsync(t => t.Id == id);

            if (tag == null)
            {
                return NotFound();
            }

            return _mapper.Map<TagDto>(tag);
        }

        // POST: api/Tags
        [HttpPost]
        public async Task<ActionResult<CreateTagDto>> PostTag(CreateTagDto createTagDto)
        {
            var tag = _mapper.Map<Tag>(createTagDto);

            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            var tagDto = _mapper.Map<TagDto>(tag);

            await _hubContext.Clients.All.SendAsync("ReceiveTag", tagDto);

            return CreatedAtAction(nameof(GetTag), new { id = tag.Id }, tagDto);
        }

        // PUT: api/Tags/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTag(int id, UpdateTagDto updateTagDto)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return NotFound();
            }

            _mapper.Map(updateTagDto, tag);

            _context.Entry(tag).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                await _hubContext.Clients.All.SendAsync("UpdateTag", _mapper.Map<TagDto>(tag));
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TagExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Tags/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return NotFound();
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("DeleteTag", id);

            return NoContent();
        }

        private bool TagExists(int id)
        {
            return _context.Tags.Any(e => e.Id == id);
        }
    }
}
