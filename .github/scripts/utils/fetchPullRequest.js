module.exports = async ({ github, owner, repo, issueNumber }) => {
  try {
    const { data } = await github.request(
      `GET /repos/${owner}/${repo}/pulls/${issueNumber}`,
    );

    return data;
  } catch (error) {
    return null;
  }
};
