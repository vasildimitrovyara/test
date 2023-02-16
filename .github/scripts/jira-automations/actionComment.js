const executeTeamAction = require('./utils/executeTeamAction');
const findBranchThroughPR = require('../utils/findBranchThroughPR');

module.exports = async ({ github, context, actionName }) => {
  console.log('PAYYYLOAD', context.payload)
  try {
    const branchName = await findBranchThroughPR({
      github,
      repo: context.payload.repository.name,
      owner: context.payload.repository.owner.login,
      issueNumber: context.payload.issue.number,
    });

    const { comment } = context.payload;

    if (!comment || !comment.body) {
      console.log('context.payload', context.payload);
      throw new Error('Comment missing');
    }

    await executeTeamAction({
      actionName,
      github,
      context,
      branchName,
      comment,
    });
  } catch (e) {
    console.error(e);
  }
};
