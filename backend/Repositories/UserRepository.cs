using Microsoft.EntityFrameworkCore;
using StellarApi.Data;
using StellarApi.Models;
using StellarApi.Repositories.Interfaces;

namespace StellarApi.Repositories;

public class UserRepository(StellarContext context) : IUserRepository
{
    public Task<User?> GetByEmailAsync(string email) =>
        context.Users.FirstOrDefaultAsync(u => u.Email == email);

    public Task<User?> GetByIdAsync(Guid id) =>
        context.Users.FirstOrDefaultAsync(u => u.Id == id);

    public async Task<User> AddAsync(User user)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return user;
    }

    public Task<bool> EmailExistsAsync(string email) =>
        context.Users.AnyAsync(u => u.Email == email);
}
