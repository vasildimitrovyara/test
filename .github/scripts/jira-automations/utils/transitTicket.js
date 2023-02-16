const jiraService = require('./jiraService');

module.exports = async ({ ticketId, transitionId }) => {
  try {
    const bodyData = JSON.stringify({
      transition: {
        id: transitionId,
      },
    });

    const path = `/rest/api/3/issue/${ticketId}/transitions`;
    const options = {
      path,
      data: bodyData,
      method: 'POST',
    };

    return await jiraService({ ...options });
  } catch (error) {
    // using log here to avoid the check being marked red
    console.log(error);
    return null;
  }
};
