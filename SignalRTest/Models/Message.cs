namespace SignalRTest.Models;

public class Message
{
    public long Id { get; set; }
    public Guid SenderId { get; set; }
    public string SenderEmail { get; set; }
    public Guid ReceiverId { get; set; }
    public string ReceiverEmail { get; set; }
    public string MessageBody { get; set; }
    public DateTime MessageDateTime { get; set; }
    public bool IsRead { get; set; }
}
