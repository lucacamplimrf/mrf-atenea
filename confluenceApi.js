const rq = require('request-promise');

class confluenceApi {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  getTemplate(pageId){
    return rq({
        uri: `https://atenea.marfeel.com/rest/api/content/${pageId}`,
        qs: {
            expand: 'body.storage'
        },
        auth: {
            user: this.username,
            pass: this.password
        },
        json: true
    });
  }

  getChilds(pageId) {
    return rq({
        uri: `https://atenea.marfeel.com/rest/api/content/${pageId}/child/page`,
        auth: {
            user: this.username,
            pass: this.password
        },
        json: true
    });
  }

  createNewPage(title, spaceKey, value, parentId) {
    return rq({
        method: 'POST',
        uri: 'https://atenea.marfeel.com/rest/api/content',
        qs: {
            expand: 'body.storage'
        },
        body: {
            type: 'page',
            title,
            ancestors:[{id: parentId}],
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
            user: this.username,
            pass: this.password
        },
        json: true
    });
  }
}

module.exports = confluenceApi;
