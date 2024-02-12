using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BimManager.DTO
{
    public class ProjectDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        
        public string FinishDate { get; set; }

        public decimal Cost { get; set; } = 0;
       
        public int Progress { get; set; } = 0;


        [Required(AllowEmptyStrings = true), DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? IfcName { get; set; }

        [NotMapped]
        public IFormFile IfcFile { get; set; }
        [NotMapped]
        public string IfcSrc { get; set; }
    }
}
