using BimManager.DTO;
using BimManager.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BimManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly BimContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProjectController(BimContext _context, IWebHostEnvironment webHostEnvironment)
        {
            this._context = _context;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("allProjects")]
        public async Task<ActionResult<List<Project>>> GetAllProjects()
        {
            var projects = await _context.Projects.Select(x => new Project()
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Status = x.Status,
                FinishDate = x.FinishDate,
                Cost = x.Cost,
                Progress = x.Progress,
                IfcName = x.IfcName,
                IfcFile = x.IfcFile,
                IfcSrc = String.Format("{0}://{1}{2}/Ifc/{3}", Request.Scheme, Request.Host, Request.PathBase, x.IfcName),
            }).ToListAsync();
            return Ok(projects);
        }

        [HttpGet("getProject/{id}", Name = "GetProject")]
        public async Task<ActionResult<Project>> GetProjectById(int id)
        {
            var project = await _context.Projects.Select(
                x => new Project()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    Status = x.Status,
                    FinishDate = x.FinishDate,
                    Cost = x.Cost,
                    Progress = x.Progress,
                    IfcName = x.IfcName,
                    IfcFile = x.IfcFile,
                    IfcSrc = String.Format("{0}://{1}{2}/Ifc/{3}", Request.Scheme, Request.Host, Request.PathBase, x.IfcName),
                }
                ).SingleOrDefaultAsync(x => x.Id == id);
            if (project == null) return NotFound(new ProblemDetails() { Title = "Cant Find Project with that id" });
            return Ok(project);
        }


        [HttpGet("ifc/{ifcFileName}")]
        public IActionResult GetIfcFile(string ifcFileName)
        {
            var filePath = Path.Combine("ifc", ifcFileName);

            if (System.IO.File.Exists(filePath))
            {
                var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                return File(fileStream, "application/octet-stream", ifcFileName);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost("newProject")]
        public async Task<ActionResult<Project>> CreateProject([FromForm] ProjectDto dto)
        {
            if (dto.Name.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Name" });
            if (dto.Description.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Description" });
            if (dto.Status.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Status" });
            if (dto.FinishDate.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Finish Date" });
            if (dto.IfcFile == null || dto.IfcFile.Length == 0) return BadRequest(new ProblemDetails() { Title = "Add ifc file of the Project" });
            //var imageName = await SaveImage(dto.ImageFile);

            var project = new Project()
            {
                Description = dto.Description,
                Status = dto.Status,
                Name = dto.Name,
                FinishDate = dto.FinishDate,
                Cost = dto.Cost,
                Progress = dto.Progress,
                IfcFile = dto.IfcFile,
                IfcSrc = dto.IfcSrc,
                IfcName = await SaveImageOrIfcFile(dto.IfcFile, "Ifc"),

                //ImageSrc = String.Format("{0}://{1}{2}/images/{3}", Request.Scheme, Request.Host, Request.PathBase, imageName),
            };
            if (_context.Projects.FirstOrDefault(x => x.Name == dto.Name) != null) return Ok("Project already exist");

            await _context.AddAsync(project);
            var result = await _context.SaveChangesAsync();
            if (result > 0) return CreatedAtRoute("GetProject", new { Id = project.Id }, project);
            return BadRequest(new ProblemDetails() { Title = "Cant save data, sth went wrong" });

        }




        [NonAction]
        public async Task<string> SaveImageOrIfcFile(IFormFile imageFile, string folderName)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(
                imageFile.FileName);
            var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath, folderName, imageName);
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);

            }
            return imageName;
        }
    }
}
