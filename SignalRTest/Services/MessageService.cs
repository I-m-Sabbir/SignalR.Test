using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SignalRTest.Data;
using SignalRTest.Dtos;
using SignalRTest.Models;

namespace SignalRTest.Services;

public interface IMessageServices
{
    Task<IList<Message>> LoadMessagesAsync(string secondUserId, string firstUserEmail);
    Task<Message> SaveMessageAsync(string senderEmail, string message, string receiverId);
    Task<IList<MessageCount>> UnreadMessagecount(string userEmail);
    Task MarkAsReadAsync(List<long> ids);
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

    public async Task<Message> SaveMessageAsync(string senderEmail, string message, string receiverId)
    {
        try
        {
            var sender = await _userManager.FindByEmailAsync(senderEmail);
            var receiver = await _userManager.FindByIdAsync(receiverId);

            var entity = new Message { SenderId = Guid.Parse(sender.Id), SenderEmail = sender.Email, ReceiverId = Guid.Parse(receiver.Id), ReceiverEmail = receiver.Email, MessageBody = message, MessageDateTime = DateTime.Now, IsRead = false };

            await _context.Messages.AddAsync(entity);
            await _context.SaveChangesAsync();

            return entity;
        }
        catch (Exception ex)
        {
            throw;
        }
    }

    public async Task<IList<MessageCount>> UnreadMessagecount(string userEmail)
    {
        try
        {

            var parameters = new Dictionary<string, object>
            {
                {"email", userEmail},
                {"isRead", 0 }
            };

            string query = $@"
SELECT m.SenderId
,COUNT(m.SenderId) AS Count
FROM Messages m with(nolock)
WHERE ReceiverEmail = ''+@email+'' and IsRead = @isRead
GROUP BY m.SenderId
";
            var result = await _context.ExecuteQueryAsync<MessageCount>(query, parameters: parameters);


            return result.result;
        }
        catch (Exception ex)
        {
            throw;
        }
    }

    public async Task MarkAsReadAsync(List<long> ids)
    {
        try
        {
            var messages = await _context.Messages.Where(x => ids.Contains(x.Id)).ToListAsync();
            foreach (var message in messages)
            {
                message.IsRead = true;
            }

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw;
        }
    }
}
