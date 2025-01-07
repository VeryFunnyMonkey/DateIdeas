using DateIdeasBackend.Data;
using DateIdeasBackend.Models;
using DateIdeasBackend.Dtos;
using DateIdeasBackend.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DateIdeasBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DateIdeasController : ControllerBase
    {
        private readonly DateIdeasContext _context;
        private readonly IMapper _mapper;
        private readonly IHubContext<DateIdeasHub> _hubContext;

        public DateIdeasController(DateIdeasContext context, IMapper mapper, IHubContext<DateIdeasHub> hubContext)
        {
            _context = context;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        // GET: api/DateIdeas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DateIdeaDto>>> GetDateIdeas()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var dateIdeas = await _context.DateIdeas.Include(d => d.Tags).Where(d => d.UserId == userId).ToListAsync();
            var dateIdeaDtos = _mapper.Map<IEnumerable<DateIdeaDto>>(dateIdeas);
            return Ok(dateIdeaDtos);
        }

        // GET: api/DateIdeas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DateIdeaDto>> GetDateIdea(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var dateIdea = await _context.DateIdeas.Include(d => d.Tags).Where(d => d.UserId == userId).FirstOrDefaultAsync(d => d.Id == id);

            if (dateIdea == null)
            {
                return NotFound();
            }

            return _mapper.Map<DateIdeaDto>(dateIdea);
        }

        // POST: api/dateideas
        [HttpPost]
        public async Task<ActionResult<CreateDateIdeaDto>> PostDateIdea(CreateDateIdeaDto createDateIdeaDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var dateIdea = _mapper.Map<DateIdea>(createDateIdeaDto);
            dateIdea.UserId = userId;

            if (createDateIdeaDto.TagIds != null)
            {
                dateIdea.Tags.Clear();
                
                var tags = await _context.Tags.Where(t => createDateIdeaDto.TagIds.Contains(t.Id)).ToListAsync();
                dateIdea.Tags.AddRange(tags);
            }

            _context.DateIdeas.Add(dateIdea);
            await _context.SaveChangesAsync();

            var dateIdeaDto = _mapper.Map<DateIdeaDto>(dateIdea);

            await _hubContext.Clients.Group(userId).SendAsync("ReceiveDateIdea", dateIdeaDto);

            return CreatedAtAction(nameof(GetDateIdea), new { id = dateIdea.Id }, dateIdeaDto);
        }

        // PUT: api/DateIdeas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDateIdea(int id, UpdateDateIdeaDto updateDateIdeaDto)
        {
            // Find the existing DateIdea
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var dateIdea = await _context.DateIdeas.Include(d => d.Tags).Where(d => d.UserId == userId).FirstOrDefaultAsync(d => d.Id == id);

            if (dateIdea == null)
            {
                return NotFound();
            }
            
            _mapper.Map(updateDateIdeaDto, dateIdea);

            if (updateDateIdeaDto.TagIds != null)
            {
                dateIdea.Tags.Clear();
                
                var tags = await _context.Tags.Where(t => updateDateIdeaDto.TagIds.Contains(t.Id)).ToListAsync();
                dateIdea.Tags.AddRange(tags);
            }

            try
            {
                await _context.SaveChangesAsync();
                await _hubContext.Clients.Group(userId).SendAsync("UpdateDateIdea", _mapper.Map<DateIdeaDto>(dateIdea));
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DateIdeaExists(id))
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

        // DELETE: api/DateIdeas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDateIdea(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var dateIdea = await _context.DateIdeas.Where(d => d.UserId == userId && d.Id == id).FirstOrDefaultAsync();
            if (dateIdea == null)
            {
                return NotFound();
            }

            _context.DateIdeas.Remove(dateIdea);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(userId).SendAsync("DeleteDateIdea", id);

            return NoContent();
        }

        private bool DateIdeaExists(int id)
        {
            return _context.DateIdeas.Any(e => e.Id == id);
        }
    }
}
