using DateIdeasBackend.Data;
using DateIdeasBackend.Dtos;
using DateIdeasBackend.Models;
using DateIdeasBackend.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace DateIdeasBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tags = await _context.Tags.Where(t => t.UserId == userId).ToListAsync();
            var tagDtos = _mapper.Map<IEnumerable<TagDto>>(tags);
            return Ok(tagDtos);

        }

        // GET: api/Tags/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TagDto>> GetTag(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tag = await _context.Tags.Include(t => t.DateIdeas).Where(t => t.UserId == userId).FirstOrDefaultAsync(t => t.Id == id);

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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tag = _mapper.Map<Tag>(createTagDto);
            tag.UserId = userId;

            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            var tagDto = _mapper.Map<TagDto>(tag);

            await _hubContext.Clients.Group(userId).SendAsync("ReceiveTag", tagDto);

            return CreatedAtAction(nameof(GetTag), new { id = tag.Id }, tagDto);
        }

        // PUT: api/Tags/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTag(int id, UpdateTagDto updateTagDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tag = await _context.Tags.Where(t => t.UserId == userId).FirstOrDefaultAsync(t => t.Id == id);
            if (tag == null)
            {
                return NotFound();
            }

            _mapper.Map(updateTagDto, tag);

            _context.Entry(tag).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                await _hubContext.Clients.Group(userId).SendAsync("UpdateTag", _mapper.Map<TagDto>(tag));
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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tag = await _context.Tags.Where(t => t.UserId == userId).FirstOrDefaultAsync(t => t.Id == id);
            if (tag == null)
            {
                return NotFound();
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(userId).SendAsync("DeleteTag", id);

            return NoContent();
        }

        private bool TagExists(int id)
        {
            return _context.Tags.Any(e => e.Id == id);
        }
    }
}
