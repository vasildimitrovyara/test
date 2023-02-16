const fetchPullRequest = require('./fetchPullRequest');

module.exports = async ({ github, owner, repo, issueNumber }) => {
  try {
    const pullRequestDetails = await fetchPullRequest({
      github,
      owner,
      repo,
      issueNumber,
    });

    return pullRequestDetails.head.ref;
  } catch (error) {
    console.error(error);
    return false;
  }
};
