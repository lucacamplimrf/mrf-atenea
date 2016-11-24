const BND_REGX = /__(.*?)__/g;
const Utils = {
  getBindings: (template) => {
    let match;
    const results = [];
    while ( (match = BND_REGX.exec(template)) !== null ) {
      const binding = match[1];
      if (binding && !results.includes(binding)) results.push(binding);
    }
    return results;
  },
  buildContent: (bindings, template) => template.replace(/__.*?__/g, (token) => bindings[token.slice(2, -2)]),
  getTemplate: (user, pass, pageId) => ({
      uri: `https://atenea.marfeel.com/rest/api/content/${pageId}`,
      qs: {
          expand: 'body.storage'
      },
      auth: {
          user,
          pass
      },
      json: true
  }),
  createNewPage: (user, pass, title, spaceKey, value) => ({
      method: 'POST',
      uri: 'https://atenea.marfeel.com/rest/api/content',
      qs: {
          expand: 'body.storage'
      },
      body: {
          type: 'page',
          title,
          space: {
              key: spaceKey
          },
          body: {
              storage: {
                  value,
                  representation: 'storage'
              }
          }
      },
      auth: {
          user,
          pass
      },
      json: true
  })
};

module.exports = Utils;
