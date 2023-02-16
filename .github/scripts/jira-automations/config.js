const checkCurrentStatus = require('./commands/checkCurrentStatus');
const addPendingLabels = require('./commands/addPendingLabels');
const moveTicket = require('./commands/moveTicket');
const addRenderLink = require('./commands/addRenderLink');
const syncReviews = require('./commands/syncReviews');
const addReleaseTagComment = require('./commands/addReleaseTagComment');
const {
  DEV_CHECK_LABELS,
  PM_CHECK_LABELS,
  QA_CHECK_LABELS,
} = require('./utils/constants');

// transition names are partial because matching is done with "includes"
module.exports = {
  'team-fields': {
    ticketPrefix: 'fmcms',
    actions: {
      renderLinkComment: [addRenderLink()],
      prReview: [syncReviews()],
      prOpened: [
        checkCurrentStatus('in progress'),
        addPendingLabels([DEV_CHECK_LABELS, PM_CHECK_LABELS]),
        moveTicket('ready for check'),
      ],
      prMerged: [
        checkCurrentStatus('ready for check'),
        moveTicket('main branch'),
      ],
      releaseSuccess: [
        checkCurrentStatus('integration'),
        addPendingLabels([QA_CHECK_LABELS]),
        moveTicket('release pr'),
        addReleaseTagComment(),
      ],
    },
  },
  'team-user-journey': {
    ticketPrefix: 'afn',
    actions: {
      renderLinkComment: [addRenderLink()],
      prReview: [syncReviews()],
      prOpened: [
        checkCurrentStatus('in progress'),
        addPendingLabels([DEV_CHECK_LABELS, PM_CHECK_LABELS]),
        moveTicket('ready for review'),
      ],
      prMerged: [checkCurrentStatus('QA Check'), moveTicket('Integration')],
      releaseSuccess: [
        checkCurrentStatus('integration'),
        moveTicket('staging'),
        addReleaseTagComment(),
      ],
    },
  },
  'team-the-blues': {
    ticketPrefix: 'afn',
    actions: {
      renderLinkComment: [addRenderLink()],
      prReview: [syncReviews()],
      prOpened: [
        checkCurrentStatus('in progress'),
        addPendingLabels([DEV_CHECK_LABELS]),
        moveTicket('ready for review'),
      ],
      prMerged: [checkCurrentStatus('QA Check'), moveTicket('Integration')],
      releaseSuccess: [
        checkCurrentStatus('integration'),
        moveTicket('staging'),
        addReleaseTagComment(),
      ],
    },
  },
  'team-subscription': {
    ticketPrefix: 'om',
    actions: {
      renderLinkComment: [addRenderLink()],
      prReview: [
        syncReviews(),
        addPendingLabels([QA_CHECK_LABELS]),
        moveTicket('ready for qa'),
      ],
      prOpened: [
        checkCurrentStatus('in progress'),
        addPendingLabels([DEV_CHECK_LABELS]),
        moveTicket('start review process'),
      ],
      prMerged: [
        checkCurrentStatus('ready for qa'),
        moveTicket('ready for release'),
      ],
      releaseSuccess: [
        checkCurrentStatus('ready for release'),
        addPendingLabels([PM_CHECK_LABELS]),
        moveTicket('staging'),
        addReleaseTagComment(),
      ],
    },
  },
};
