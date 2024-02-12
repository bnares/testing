using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BimManager.Entities
{
    public class Project
    {

        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
       
        public string FinishDate { get; set; }
        [Required]

        public decimal Cost { get; set; } = 0;
        [Range(0, 100), Required]
        public int Progress { get; set; } = 0;

        [Required(AllowEmptyStrings = true), DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? IfcName { get; set; }

        [NotMapped]
        public IFormFile IfcFile { get; set; }
        [NotMapped]
        public string IfcSrc { get; set; }
    }
}
