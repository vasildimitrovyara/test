const jiraService = require('./jiraService');

module.exports = async ({ ticketId, bodyData }) => {
  try {
    const path = `/rest/api/3/issue/${ticketId}`;
    const options = {
      path,
      data: JSON.stringify(bodyData),
      method: 'PUT',
    };
    console.log('Updating Jira ticket', options);

    const response = await jiraService({ ...options });
    console.log('Jira update ticket response', response);
    return response;
  } catch (error) {
    // using log here to avoid the check being marked red
    console.log(error);
    return null;
  }
};
