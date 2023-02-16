const addCommentToTicket = require('../utils/addCommentToTicket');

const GITHUB_RELEASE_BASE_URL =
  'https://github.com/yaradigitallabs/pm-web-frontend/releases/tag';

const extractReleaseTag = (commentBody) => {
  const tag = commentBody.split('`')[1];

  // checks for semantic release default pattern
  const isValidTag = tag && tag.startsWith('v') && !isNaN(tag[tag.length - 1]);

  if (!isValidTag) return null;

  return tag;
};

const addReleaseCommentToTicket = async ({ releaseTag, ticketId }) => {
  const bodyData = {
    body: {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Included in release: ',
              type: 'text',
            },
            {
              type: 'text',
              text: releaseTag,
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: `${GITHUB_RELEASE_BASE_URL}/${releaseTag}`,
                    title: 'View release',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  };

  await addCommentToTicket({
    ticketId,
    bodyData,
  });
};

module.exports =
  () =>
  async ({ ticketId, comment }) => {
    console.log('Adding release tag comment', comment.body);

    const releaseTag = extractReleaseTag(comment.body);
    if (!releaseTag) throw new Error('Release tag missing');

    await addReleaseCommentToTicket({ ticketId, releaseTag });

    return true;
  };
