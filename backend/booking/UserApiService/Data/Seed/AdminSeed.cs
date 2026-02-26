using Microsoft.EntityFrameworkCore;
using UserApiService.Models;
using UserApiService.Models.Enums;
using UserApiService.Services;


namespace UserApiService.Data.Seed
{
    public static class AdminSeed
    {
        // super password is SuperAdmin123
        public static void Seed(ModelBuilder modelBuilder)
        {
            var passwordHasher = new PasswordHasher();
            passwordHasher.CreatePasswordHash("SuperAdmin123", out byte[] superHash, out byte[] superSalt);
            passwordHasher.CreatePasswordHash("UserPass123!", out byte[] userHash, out byte[] userSalt);

            modelBuilder.Entity<SuperAdmin>().HasData(new SuperAdmin
            {
                id = 1,
                Username = "superadmin",
                Email = "super@system.local",
                PasswordSalt = superSalt,
                PasswordHash = superHash,
                //PasswordSalt = Convert.FromBase64String("V8wvqBbePjDdjC3iI5L4FYThnxnJKv59NCUZ+uSkC9v3hpuX8kFFZKQETn3TqG8mhBfWZB+HqKavNqCpxZBlxA=="),
                //PasswordHash = Convert.FromBase64String("Qb/7CDMxTQqtY2cT31K8K8EQwGLcJhqTfHtzz/4DYfV5mTRhBwfanma6Yjmjcbl4vw7hLipArjC7N3rPx4EoXw=="),
                CountryId = 6,
                RoleName = UserRole.SuperAdmin
            });

            modelBuilder.Entity<Client>().HasData(new Client
            {
                id = 2,
                Username = "Yuliia Deviatka",
                Email = "user@oselya.app",
                PhoneNumber = "+380685433776",
                PasswordSalt = userSalt,
                PasswordHash = userHash,
                CountryId = 6,
                RoleName = UserRole.Client,
                IsBlocked = false
            });
        }
    }
}
