const parseBranchName = require('./parseBranchName');

module.exports = async (args) => {
  const { team, teamName, ticketId } = parseBranchName(args.branchName);
  console.log({ team, teamName, ticketId, actionName: args.actionName });

  if (
    team.actions[args.actionName] &&
    team.actions[args.actionName].length > 0
  ) {
    for (let i = 0; i < team.actions[args.actionName].length; i++) {
      // return types:
      // true => execute next action
      // false => stop execution without an error
      // error => stop, catch and log
      const result = await team.actions[args.actionName][i]({
        ...args,
        team,
        teamName,
        ticketId,
      });
      if (!result) break;
    }
  }
};
