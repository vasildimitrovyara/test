const fetchTicket = require('../utils/fetchTicket');
const updateTicket = require('../utils/updateTicket');

module.exports =
  (labelGroups) =>
  async ({ ticketId }) => {
    console.log('Adding pending labels', labelGroups);

    const ticket = await fetchTicket({ ticketId: ticketId });
    if (!ticket) throw new Error('Ticket not found');

    const { labels } = ticket.fields;
    console.log('Ticket found', labels);

    let labelsToAdd = [];
    let labelsToRemove = [];

    labelGroups.forEach((group) => {
      const hasPendingLabel = labels.includes(group.pending);
      if (!hasPendingLabel) {
        labelsToAdd.push({ add: group.pending });
        labelsToRemove.push({ remove: group.approved });
        labelsToRemove.push({ remove: group.denied });
      }
    });

    if (!labelsToAdd.length) return true;

    const bodyData = {
      update: {
        labels: [...labelsToAdd, ...labelsToRemove],
      },
    };

    await updateTicket({
      ticketId,
      bodyData,
    });

    return true;
  };
