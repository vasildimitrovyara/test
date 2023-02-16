const moveTicket = require('./moveTicket');
const addPendingLabels = require('./addPendingLabels');

const groupReviewsByUser = require('../../utils/groupReviewsByUser');
const extractIssueNumberFromUrl = require('../../utils/extractIssueNumberFromUrl');
const updateTicket = require('../utils/updateTicket');
const { REVIEW_STATUSES } = require('../../utils/constants');
const { DEV_CHECK_LABELS, QA_CHECK_LABELS, DESIGN_CHECK_LABELS } = require('../utils/constants');

const REVIEW_STATES = {
  missing: 'missing',
  negative: 'negative',
  positive: 'positive',
};

const PR_REVIEW_STATES = {
  pending: 'pending',
  denied: 'denied',
  approved: 'approved',
};

const addLatestMeaningfulReviewState = (users) =>
  users.map((user) => ({
    ...user,
    state: user.reviews.reduce((state, review) => {
      const reviewState = review.state;

      if (reviewState === REVIEW_STATUSES.changesRequested) {
        return REVIEW_STATES.negative;
      }

      if (reviewState === REVIEW_STATUSES.approved) {
        return REVIEW_STATES.positive;
      }

      // if its a comment or any other thing, just maintain last state
      return state;
    }, REVIEW_STATES.missing),
  }));

const getReviewStateSums = (users) =>
  users.reduce(
    (statusSum, reviewer) => ({
      ...statusSum,
      [reviewer.state]: statusSum[reviewer.state] + 1,
    }),
    {
      negative: 0,
      positive: 0,
      missing: 0,
    },
  );

const getReviewState = ({ negative, positive }) => {
  if (negative) {
    return PR_REVIEW_STATES.denied;
  }

  if (positive > 1) {
    return PR_REVIEW_STATES.approved;
  }

  return PR_REVIEW_STATES.pending;
};

const getReviews = async ({ github, contextData }) => {
  try {
    const reviews = await github.paginate(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
      contextData,
    );

    return reviews;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getPRNumber = (context) => {
  if (context.payload.number) {
    return context.payload.number;
  }
  if (context.payload.review.pull_request_url) {
    return extractIssueNumberFromUrl(context.payload.review.pull_request_url);
  }

  return null;
};

const generateUpdatedLabels = (label) =>
  Object.keys(DEV_CHECK_LABELS).map((checkKey) => ({
    [label === checkKey ? 'add' : 'remove']: DEV_CHECK_LABELS[checkKey],
  }));

const syncDevCheckOnIssue = async ({ checkId, ticketId }) => {
  try {
    const bodyData = {
      update: {
        labels: generateUpdatedLabels(checkId),
      },
    };

    await updateTicket({
      ticketId,
      bodyData,
    });
  } catch (error) {
    // using log here to avoid the check being marked red
    console.log(error);
  }
};

const removeLabels = async ({ ticketId, checkLabels }) => {
  try {
    const bodyData = {
      update: {
        labels: Object.keys(checkLabels).map((label) => ({
          remove: checkLabels[label],
        })),
      },
    };

    await updateTicket({
      ticketId,
      bodyData,
    });
  } catch (error) {
    console.log(error);
  }
};

// will return true to execute next action
// if PR has 2 approvals
module.exports = () => async ({ github, ticketId, context }) => {
  console.log('Syncing reviews');

  const pullRequestNumber = getPRNumber(context);
  if (!pullRequestNumber) throw new Error('Failed figuring out the PR number');

  const contextData = {
    repo: context.payload.repository.name,
    owner: context.payload.repository.owner.login,
    pull_number: pullRequestNumber,
  };

  const reviews = await getReviews({ github, contextData });

  if (!reviews || !reviews.length) {
    console.log('No reviews found');
    await syncDevCheckOnIssue({
      ticketId,
      checkId: PR_REVIEW_STATES.pending,
    });

    return false;
  }

  const usersWithReviews = groupReviewsByUser(reviews);
  const usersWithReviewState = addLatestMeaningfulReviewState(usersWithReviews);
  const reviewStateSums = getReviewStateSums(usersWithReviewState);
  const reviewState = getReviewState(reviewStateSums);
  const isApproved = reviewState === 'approved';

  console.log({
    usersWithReviews,
    usersWithReviewState,
    reviewStateSums,
    reviewState,
  });

  await syncDevCheckOnIssue({
    ticketId,
    checkId: reviewState,
  });

  if (isApproved) {
    await moveTicket('QA Check')({ ticketId });
    await addPendingLabels([QA_CHECK_LABELS, DESIGN_CHECK_LABELS])({ ticketId });
    await removeLabels({ ticketId, checkLabels: DEV_CHECK_LABELS });
  }

  return isApproved;
};
