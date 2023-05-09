using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SignalRTest.Hubs
{
    public class ChatHub : Hub
    {
        [Authorize]
        public async Task SendMessage(string message, string receiver)
        {
            string user = Context.User!.Identity!.Name!;
            await Clients.User(receiver).SendAsync("messageSend", message, user);
        }
    }
}
