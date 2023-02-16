const fetchTicket = require('../utils/fetchTicket');

module.exports =
  (expectedStatus) =>
  async ({ ticketId }) => {
    console.log('Checking for ticket status', expectedStatus);

    const ticket = await fetchTicket({ ticketId: ticketId });
    if (!ticket) throw new Error('Ticket not found');

    const { status } = ticket.fields;
    console.log('Ticket found', status);

    if (!status.name.toLowerCase().includes(expectedStatus.toLowerCase()))
      throw new Error(`Ticket is not in status ${expectedStatus}`);

    return true;
  };
