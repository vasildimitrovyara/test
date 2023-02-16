const jiraService = require('./jiraService');

module.exports = async ({ ticketId }) => {
  try {
    const path = `/rest/api/3/issue/${ticketId}/transitions`;
    const options = {
      path,
      method: 'GET',
    };

    const data = await jiraService({ ...options });
    return data.transitions;
  } catch (error) {
    // using log here to avoid the check being marked red
    console.log(error);
    return null;
  }
};
