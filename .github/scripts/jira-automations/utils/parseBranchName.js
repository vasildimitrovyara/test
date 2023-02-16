const SUPPORTED_TEAMS = require('../config');

// valid branch name format is
// team-name/prefix-123--some-name
module.exports = (branchName) => {
  console.log('Parsing branch name', branchName);
  if (!branchName) throw new Error('Branch name missing');

  // extract from the begining (if it starts with team-)
  // until the first / char
  // team-name/prefix-123--some-name => team-name
  const teamName = (branchName.match(/^team-[^/]*/) || [])[0];
  if (!teamName) throw new Error('Team name cannot be parsed');

  const team = SUPPORTED_TEAMS[teamName];
  if (!team) throw new Error('Team not found');

  // extract from the first / char until the --
  // and make sure there are 2 parts split by -
  // 1st uses word chard and the second one numbers
  // team-name/prefix-123--some-name => prefix-123
  const ticketId = (branchName.match(/[^\/](\w)+-(\d)+[^--]/) || [])[0];
  if (!ticketId) throw new Error('Ticket id cannot be parsed');

  if (!ticketId.startsWith(team.ticketPrefix))
    throw new Error('Ticket id prefix not matching team ticket prefix');

  return {
    team,
    teamName,
    ticketId,
  };
};
