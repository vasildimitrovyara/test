const extractTeamName = require('./utils/extractTeamName');

const DEPENDABOT = 'dependabot';

const labelsByTeam = {
  main: ['release-proposal'],
  snyk: ['infra', 'security'],
  'phrase-translations': ['infra'],
  'team-qa': ['qa'],
  'team-infra': ['infra'],
  'team-the-blues': ['the-blues'],
  'team-user-journey': ['user-journey'],
  'team-cloud-and-sre': ['cloud-and-sre'],
  'team-miscellaneous-development': ['wildcard'],
  //deprecated teams
  'team-cnp': ['crop-nutrition'],
  'team-ouf': ['user-management'],
  'team-fields': ['field-and-vra'],
  'team-subscription': ['subscription-management'],
  'team-crop-growth': ['crop-growth'],
  //deprecated teams
};

function shouldSkipLabeling(teamName) {
  return teamName.includes(DEPENDABOT);
}

function addTeamLabels({ github, teamName, contextData }) {
  if (shouldSkipLabeling(teamName)) return;

  const teamLabels = labelsByTeam[teamName];

  if (teamLabels) {
    github.issues.addLabels({
      ...contextData,
      labels: teamLabels,
    });
  } else {
    throw `
      We didn't find a correct label for the team ${teamName}.
      Please, make sure you are using our team CLI:
      yarn branch - to create your working branch
      yarn commit - to commit your changes
    `;
  }
}

async function checkForTeamLabel({ github, teamName, contextData }) {
  if (shouldSkipLabeling(teamName)) return false;

  const labels = [
    'qa',
    'infra',
    'field-and-vra',
    'crop-nutrition',
    'user-management',
    'release-proposal',
    'subscription-management',
    'crop-growth',
  ];

  const { data } = await github.issues.listLabelsOnIssue({
    ...contextData,
  });
  const existingLabels = data.map((item) => item.name);
  const hasTeamLabel = existingLabels.some((item) => labels.indexOf(item) > -1);

  return !hasTeamLabel;
}

module.exports = async ({ github, context, ref }) => {
  const teamName = extractTeamName(ref);
  const contextData = {
    repo: context.repo.repo,
    owner: context.repo.owner,
    issue_number: context.issue.number,
  };

  if (shouldSkipLabeling(teamName)) return;

  const shoudAddTeamLabel = await checkForTeamLabel({
    github,
    teamName,
    contextData,
  });

  if (shoudAddTeamLabel) addTeamLabels({ github, teamName, contextData });
};
