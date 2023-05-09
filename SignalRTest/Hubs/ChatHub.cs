using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SignalRTest.Hubs
{
    public class ChatHub : Hub
    {
        [Authorize]
        public async Task SendMessage(string message)
        {
            string user = Context.User!.Identity!.Name!;
            await Clients.User("b61ccab7-8145-467d-915f-4f32827914f4").SendAsync("messageSend", message, user);
        }
    }
}
