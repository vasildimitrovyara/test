const addCommentToTicket = require('../utils/addCommentToTicket');

const extractRenderLink = (comment) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = comment.match(urlRegex);

  const hasMatchingUrls = urls && urls.length;
  if (!hasMatchingUrls) return null;

  const renderUrl = urls.find((url) => url.includes('onrender.com'));

  if (!renderUrl) return null;

  if (renderUrl[renderUrl.length - 1] === '.') {
    return renderUrl.slice(0, -1);
  }

  return renderUrl;
};

const addRenderLinkCommentToTicket = async ({ renderLink, ticketId }) => {
  const bodyData = {
    body: {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              text: 'Render link: ',
              type: 'text',
            },
            {
              type: 'text',
              text: renderLink,
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: renderLink,
                    title: 'OnRender Link',
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
    console.log('Adding render link', comment.body);

    const renderLink = extractRenderLink(comment.body);
    if (!renderLink) throw new Error('Render link missing');

    await addRenderLinkCommentToTicket({
      ticketId,
      renderLink,
    });

    return true;
  };
