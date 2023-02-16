module.exports = (ref) => {
  const SNYK = 'snyk-';
  const TEAM_PREFIX = 'team-';
  const isSnykBranch = ref.startsWith(SNYK);
  const isTeamBranch = ref.startsWith(TEAM_PREFIX) && ref.includes('/');

  if (isSnykBranch) {
    return ref.split('-')[0];
  }

  if (isTeamBranch) {
    return ref.split('/')[0];
  }

  return ref;
};
