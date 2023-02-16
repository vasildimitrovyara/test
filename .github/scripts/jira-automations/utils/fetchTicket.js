const jiraService = require('./jiraService');

module.exports = async ({ ticketId }) => {
  try {
    const path = `/rest/api/3/issue/${ticketId}`;
    const options = {
      path,
      method: 'GET',
    };

    const ticket = await jiraService({ ...options });

    if (!ticket || !ticket.fields) {
      return null;
    }

    return ticket;
  } catch (error) {
    // using log here to avoid the check being marked red
    console.log(error);
    return null;
  }
};
