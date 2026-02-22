using Microsoft.EntityFrameworkCore;
using UserApiService.Models;
using UserApiService.Models.Enums;
using UserApiService.Services;


namespace UserApiService.Data.Seed
{
    public static class AdminSeed
    {
        // Seed default accounts for local/dev environment.
        public static void Seed(ModelBuilder modelBuilder)
        {
            var passwordHasher = new PasswordHasher();
            passwordHasher.CreatePasswordHash("SuperAdmin123", out byte[] superHash, out byte[] superSalt);
            modelBuilder.Entity<SuperAdmin>().HasData(new SuperAdmin
            {
                id = 1,
                Username = "superadmin",
                Email = "super@system.local",
                PasswordSalt = superSalt,
                PasswordHash = superHash,
                CountryId = 6,
                RoleName = UserRole.SuperAdmin
            });

            passwordHasher.CreatePasswordHash("UserPass123!", out byte[] userHash, out byte[] userSalt);
            modelBuilder.Entity<Client>().HasData(new Client
            {
                id = 2,
                Username = "oselya_user",
                Email = "user@oselya.app",
                PasswordSalt = userSalt,
                PasswordHash = userHash,
                CountryId = 6,
                RoleName = UserRole.Client,
                BonusCount = 0,
            });

            passwordHasher.CreatePasswordHash("OwnerPass123!", out byte[] ownerHash, out byte[] ownerSalt);
            modelBuilder.Entity<Owner>().HasData(new Owner
            {
                id = 3,
                Username = "oselya_owner",
                Email = "owner@oselya.app",
                PasswordSalt = ownerSalt,
                PasswordHash = ownerHash,
                CountryId = 6,
                RoleName = UserRole.Owner,
            });

            passwordHasher.CreatePasswordHash("AdminPass123!", out byte[] adminHash, out byte[] adminSalt);
            modelBuilder.Entity<Admin>().HasData(new Admin
            {
                id = 4,
                Username = "oselya_admin",
                Email = "admin@oselya.app",
                PasswordSalt = adminSalt,
                PasswordHash = adminHash,
                CountryId = 6,
                RoleName = UserRole.Admin,
                WorkRegion = "UA",
            });
        }
    }
}
