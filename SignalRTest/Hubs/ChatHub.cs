using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRTest.Services;

namespace SignalRTest.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IMessageServices _messageServices;

        public ChatHub(IMessageServices messageServices)
        {
            _messageServices = messageServices;
        }

        [Authorize]
        public async Task SendMessage(string message, string receiver)
        {
            string user = Context.User!.Identity!.Name!;

            await _messageServices.SaveMessageAsync(user, message, receiver);
                        
            await Clients.User(receiver).SendAsync("messageSend", message, user);
        }

        [Authorize]
        public async Task LoadPreviousMessage(string receiverId, string senderEmail)
        {
            var messages = await _messageServices.LoadMessagesAsync(receiverId, senderEmail);
            messages = messages.OrderBy(x => x.MessageDateTime).ToList();
            await Clients.Caller.SendAsync("LoadPreviousMessage", messages);
        }
    }
}
