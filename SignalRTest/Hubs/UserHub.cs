using Microsoft.AspNetCore.SignalR;

namespace SignalRTest.Hubs
{
    public class UserHub : Hub
    {
        public static int TotalViews { get; set; } = 0;
        public static int TotalUsers { get; set; } = 0;

        public override async Task<Task> OnConnectedAsync()
        {
            TotalUsers += 1;
            await Clients.All.SendAsync("updateTotalUsers", TotalUsers);
            return base.OnConnectedAsync();
        }

        public override async Task<Task> OnDisconnectedAsync(Exception? exception)
        {
            TotalUsers -= 1;
            await Clients.All.SendAsync("updateTotalUsers", TotalUsers);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task NewWindowLoaded()
        {
            TotalViews++;
            await Clients.All.SendAsync("updateTotalViews", TotalViews);
        }

    }
}
