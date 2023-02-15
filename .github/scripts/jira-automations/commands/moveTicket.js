const getAvailableTransitionId = require('../utils/getAvailableTransitionId');
const transitTicket = require('../utils/transitTicket');

module.exports =
  (transitionName) =>
  async ({ ticketId }) => {
    console.log(`moveTicket() => Moving ticket ${ticketId} to ${transitionName}`);

    const transitionId = await getAvailableTransitionId({
      ticketId,
      transitionName,
    });

    if (!transitionId) throw new Error('Transition id not found');

    await transitTicket({
      ticketId,
      transitionId,
    });

    return true;
  };
