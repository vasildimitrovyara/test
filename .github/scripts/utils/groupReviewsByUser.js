const { REVIEW_STATUSES } = require('./constants');

const shouldDiscard = (states) => {
  const latestDismissIndex = states.lastIndexOf(REVIEW_STATUSES.dismissed);

  if (latestDismissIndex < 0) {
    return false;
  }

  const statesAfterLastDismiss = states.slice(latestDismissIndex);

  return !statesAfterLastDismiss.some(
    (state) =>
      state === REVIEW_STATUSES.approved ||
      state === REVIEW_STATUSES.changesRequested,
  );
};

module.exports = (reviews) => {
  const usersWithReviews = Object.values(
    reviews.reduce((group, review) => {
      const userId = review.user.login;

      const existingUser = group[userId];

      if (existingUser) {
        return {
          ...group,
          [userId]: {
            ...existingUser,
            reviews: [...existingUser.reviews, review],
          },
        };
      }

      return {
        ...group,
        [userId]: {
          user: userId,
          reviews: [review],
        },
      };
    }, {}),
  );

  const withSortedReviews = usersWithReviews.map((user) => ({
    ...user,
    reviews: user.reviews.sort((a, b) =>
      a.submitted_at > b.submitted_at ? 1 : -1,
    ),
  }));

  const withLatestReview = withSortedReviews.map((user) => ({
    ...user,
    latestReview: user.reviews[user.reviews.length - 1],
  }));

  // check if has a dismissal and discard if there is no positive or negatives after it
  const withoutDismissed = withLatestReview.filter(
    (user) => !shouldDiscard(user.reviews.map(({ state }) => state)),
  );

  return withoutDismissed;
};
