using CLOTHES_SHOP.Server.Model;
using Microsoft.EntityFrameworkCore;


namespace CLOTHES_SHOP.Server.Data
{
    public class DataContext : DbContext
    {
        private readonly IConfiguration _config;
        public DataContext(DbContextOptions<DataContext> options, IConfiguration config) : base(options)
        {
            _config = config;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string connectionString = _config.GetConnectionString("DefaultConnection");
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>()
                .HasMany(e => e.Roles)
                .WithMany(e => e.Accounts)
                .UsingEntity<Account_Roles>(

                    l => l.HasOne<Role>().WithMany().HasForeignKey(e => e.Role_Id),
                    r => r.HasOne<Account>().WithMany().HasForeignKey(e => e.Account_Id));

            modelBuilder.Entity<Role>()
                .HasMany(e => e.Permissions)
                .WithMany(e => e.Roles)
                .UsingEntity<Role_Permissions>(
                    l => l.HasOne<Permission>().WithMany().HasForeignKey(e => e.Permission_Id),
                    r => r.HasOne<Role>().WithMany().HasForeignKey(e => e.Role_Id));

            modelBuilder.Entity<Account>()
                .HasMany(ac => ac.Addresses)
                .WithOne(a => a.Account)
                .HasForeignKey(a => a.Account_Id);

            modelBuilder.Entity<Account>()
                .HasMany(a => a.Orders)
                .WithOne(o => o.Account)
                .HasForeignKey(o => o.Account_Id);

            //cac hoa don do nhan vien tao
            modelBuilder.Entity<Account>()
                .HasMany(a => a.Invoices)
                .WithOne(i => i.Account)
                .HasForeignKey(i => i.Staff_Id);

            modelBuilder.Entity<Account>()
                .HasOne(u => u.Cart)
                .WithOne(c => c.Account)
                .HasForeignKey<Cart>(c => c.Account_Id);

            modelBuilder.Entity<Cart>()
                .HasMany(c => c.Product_Variants)
                .WithMany(pv => pv.Carts)
                .UsingEntity<Cart_Details>(
                    l => l.HasOne<Product_Variant>().WithMany().HasForeignKey(pv => pv.Variant_Id),
                    r => r.HasOne<Cart>().WithMany().HasForeignKey(c => c.Cart_Id));

            //modelBuilder.Entity<Product_Variant>()
            //    .HasMany(pv => pv.Orders)
            //    .WithMany(o => o.Product_Variants)
            //    .UsingEntity<Order_Details>(
            //        l => l.HasOne<Order>().WithMany().HasForeignKey(o => o.Order_Id),
            //        r => r.HasOne<Product_Variant>().WithMany().HasForeignKey(pv => pv.Variant_Id));

            modelBuilder.Entity<Product_Variant>()
                .HasMany(pv => pv.Orders)
                .WithMany(o => o.Product_Variants)
                .UsingEntity<Order_Details>(
                    j => j
                        .HasOne(od => od.Order)
                        .WithMany(o => o.Order_Details)
                        .HasForeignKey(od => od.Order_Id),
                    j => j
                        .HasOne(od => od.Product_Variant)
                        .WithMany(pv => pv.Order_Details)
                        .HasForeignKey(od => od.Variant_Id)
                );

            modelBuilder.Entity<Product_Variant>()
             .HasMany(pv => pv.Orders)
             .WithMany(o => o.Product_Variants)
             .UsingEntity<Review>(
                 j => j
                     .HasOne(rv => rv.Order)
                     .WithMany(o => o.Reviews)
                     .HasForeignKey(od => od.Order_Id),
                 j => j
                     .HasOne(rv => rv.Product_Variant)
                     .WithMany(pv => pv.Reviews)
                     .HasForeignKey(rv => rv.Variant_Id)
             );

            modelBuilder.Entity<Product>()
                .HasMany(p => p.Product_Variants)
                .WithOne(pv => pv.Product)
                .HasForeignKey(pv => pv.Product_Id);

            modelBuilder.Entity<Product>()
                .HasMany(p => p.Categories)
                .WithMany(c => c.Products)
                .UsingEntity<Category_Details>(
                    l => l.HasOne<Category>().WithMany().HasForeignKey(c => c.Category_Id),
                    r => r.HasOne<Product>().WithMany().HasForeignKey(p => p.Product_Id));

            modelBuilder.Entity<Product>()
                .HasMany(p => p.Promotions)
                .WithMany(pr => pr.Products)
                .UsingEntity<Promotion_Details>(
                    l => l.HasOne<Promotion>().WithMany().HasForeignKey(pr => pr.Promotion_Id),
                    r => r.HasOne<Product>().WithMany().HasForeignKey(p => p.Product_Id));

            modelBuilder.Entity<Address>()
                .HasMany(a => a.Orders)
                .WithOne(o => o.Address)
                .HasForeignKey(o => o.Address_Id);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Invoice)
                .WithOne(i => i.Order)
                .HasForeignKey<Invoice>(i => i.Order_Id);


            modelBuilder.Entity<Order_Details>()
            .HasKey(od => new { od.Variant_Id, od.Order_Id });

        }

        public DbSet<Account> ACCOUNT { get; set; }
        public DbSet<Role> ROLE { get; set; }
        public DbSet<Permission> PERMISSION { get; set; }
        public DbSet<Address> ADDRESS { get; set; }
        public DbSet<Cart> CART {  get; set; }
        public DbSet<Cart_Details> CART_DETAILS { get; set; }
        public DbSet<Product> PRODUCT { get; set; }
        public DbSet<Product_Variant> PRODUCT_VARIANT { get; set; }
        public DbSet<Category> CATEGORY { get; set; }
        public DbSet<Promotion> PROMOTION { get; set; }
        public DbSet<Order> ORDER { get; set; }
        public DbSet<Invoice> INVOICE { get; set; }
        public DbSet<Review> REVIEW { get; set; }
        public DbSet<Order_Details> ORDER_DETAILS { get; set; }
        public DbSet<Promotion_Details> PROMOTION_DETAILS { get; set; }


    }
}
