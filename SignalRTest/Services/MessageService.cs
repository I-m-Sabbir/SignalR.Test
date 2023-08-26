using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SignalRTest.Data;
using SignalRTest.Models;

namespace SignalRTest.Services;

public interface IMessageServices
{
    Task<IList<Message>> LoadMessagesAsync(string secondUserId, string firstUserEmail);
    Task SaveMessageAsync(string senderEmail, string message, string receiverId);
    Task<int> UnreadMessagecount(string userEmail);
}

public class MessageServices : IMessageServices
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public MessageServices(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IList<Message>> LoadMessagesAsync(string secondUserId, string firstUserEmail)
    {
        try
        {
            return await _context.Messages.Where(x => (x.ReceiverEmail == firstUserEmail && x.SenderId == Guid.Parse(secondUserId)) || (x.ReceiverId == Guid.Parse(secondUserId) && x.SenderEmail == firstUserEmail)).OrderByDescending(x => x.MessageDateTime).Skip(0).Take(10).ToListAsync();
        }
        catch (Exception ex)
        {
            throw;
        }
    }

    public async Task SaveMessageAsync(string senderEmail, string message, string receiverId)
    {
        try
        {
            var sender = await _userManager.FindByEmailAsync(senderEmail);
            var receiver = await _userManager.FindByIdAsync(receiverId);

            var entity = new Message { SenderId = Guid.Parse(sender.Id), SenderEmail = sender.Email, ReceiverId = Guid.Parse(receiver.Id), ReceiverEmail = receiver.Email, MessageBody = message, MessageDateTime = DateTime.Now, IsRead = false };

            await _context.Messages.AddAsync(entity);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw;
        }
    }

    public async Task<int> UnreadMessagecount(string userEmail)
    {
        try
        {
            return await _context.Messages.Where(x => x.ReceiverEmail == userEmail && x.IsRead == false).CountAsync();
        }
        catch (Exception ex)
        {
            throw;
        }
    }
}
