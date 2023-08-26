using SignalRTest.Services;

namespace SignalRTest.Extensions;

public static class ServiceExtensions
{
    /// <summary>
    /// Adds Message services to the specified <see cref="IServiceCollection" />.
    /// </summary>
    public static void AddServices(this IServiceCollection services)
    {
        services.AddScoped<IMessageServices, MessageServices>();
    }
}
