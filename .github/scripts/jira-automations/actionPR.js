const executeTeamAction = require('./utils/executeTeamAction');

module.exports = async ({
  github,
  context,
  head_ref: branchName,
  actionName,
}) => {
  try {
    await executeTeamAction({
      actionName,
      github,
      context,
      branchName,
    });
  } catch (e) {
    console.error(e);
  }
};
