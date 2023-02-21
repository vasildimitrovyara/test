const executeTeamAction = require('./utils/executeTeamAction');
const findBranchThroughPR = require('../utils/findBranchThroughPR');

const Utils = () => {
    this.get = async ({ github, context, actionName }) => {
        setTimeout(async () => {
          try {
            const branchName = await findBranchThroughPR({
              github,
              repo: context.payload.repository.name,
              owner: context.payload.repository.owner.login,
              issueNumber: context.payload.number,
            });
        
            const { comment } = context.payload;
            if (!comment || !comment.body) {
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
        }, 30000)
      };
}

module.exports = Utils;
// module.exports = async ({ github, context, actionName }) => {
//   setTimeout(async () => {
//     try {
//       const branchName = await findBranchThroughPR({
//         github,
//         repo: context.payload.repository.name,
//         owner: context.payload.repository.owner.login,
//         issueNumber: context.payload.number,
//       });
  
//       const { comment } = context.payload;
//       if (!comment || !comment.body) {
//         throw new Error('Comment missing');
//       }
  
//       await executeTeamAction({
//         actionName,
//         github,
//         context,
//         branchName,
//         comment,
//       });
//     } catch (e) {
//       console.error(e);
//     }
//   }, 30000)
// };


// const parseBranchName = require('./parseBranchName');

// module.exports = async (args) => {
//   const { team, teamName, ticketId } = parseBranchName(args.branchName);
//   console.log({ team, teamName, ticketId, actionName: args.actionName });

//   if (
//     team.actions[args.actionName] &&
//     team.actions[args.actionName].length > 0
//   ) {
//     for (let i = 0; i < team.actions[args.actionName].length; i++) {
//       // return types:
//       // true => execute next action
//       // false => stop execution without an error
//       // error => stop, catch and log
//       const result = await team.actions[args.actionName][i]({
//         ...args,
//         team,
//         teamName,
//         ticketId,
//       });
//       if (!result) break;
//     }
//   }
// };


// const SUPPORTED_TEAMS = require('../config');

// // valid branch name format is
// // team-name/prefix-123--some-name
// module.exports = (branchName) => {
//   console.log('Parsing branch name', branchName);
//   if (!branchName) throw new Error('Branch name missing');

//   // extract from the begining (if it starts with team-)
//   // until the first / char
//   // team-name/prefix-123--some-name => team-name
//   const teamName = (branchName.match(/^team-[^/]*/) || [])[0];
//   if (!teamName) throw new Error('Team name cannot be parsed');

//   const team = SUPPORTED_TEAMS[teamName];
//   if (!team) throw new Error('Team not found');

//   // extract from the first / char until the --
//   // and make sure there are 2 parts split by -
//   // 1st uses word chard and the second one numbers
//   // team-name/prefix-123--some-name => prefix-123
//   const ticketId = (branchName.match(/[^\/](\w)+-(\d)+[^--]/) || [])[0];
//   if (!ticketId) throw new Error('Ticket id cannot be parsed');

//   if (!ticketId.startsWith(team.ticketPrefix))
//     throw new Error('Ticket id prefix not matching team ticket prefix');

//   return {
//     team,
//     teamName,
//     ticketId,
//   };
// };
