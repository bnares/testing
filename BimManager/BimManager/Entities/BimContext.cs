using Microsoft.EntityFrameworkCore;

namespace BimManager.Entities
{
    public class BimContext : DbContext
    {
        public BimContext(DbContextOptions<BimContext> options) : base(options) 
        {

        }

        public DbSet<Project> Projects { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Project>(item =>
            {
                item.Property(x => x.Cost).HasColumnType("decimal(35,2)");
                item.Property(x => x.Name).HasColumnType("varchar(50)").IsRequired();
                item.Property(x => x.Description).HasColumnType("varchar(100)").IsRequired();
                item.Property(x => x.Status).HasColumnType("varchar(10)").IsRequired();
                item.Property(x => x.FinishDate).HasColumnType("varchar(30)");
                
            });
        }
    }
}
