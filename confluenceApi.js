const rq = require('request-promise');

class confluenceApi {
    constructor(username, password) {
        this.auth = {
            username,
            password
        };
    }

    getTemplate(pageId) {
        return rq({
                uri: `https://atenea.marfeel.com/rest/api/content/${pageId}`,
                qs: {
                    expand: 'body.storage'
                },
                auth: this.auth,
                json: true
            })
            .then((page) => {
                return {
                    body: page.body.storage.value,
                    title: page.title
                }
            })
    }

    getChilds(pageId) {
        return rq({
            uri: `https://atenea.marfeel.com/rest/api/content/${pageId}/child/page`,
            auth: this.auth,
            json: true
        }).
        then(childs => childs.results.map(child => child.id));
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
                ancestors: [{
                    id: parentId
                }],
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
            auth: this.auth,
            json: true
        });
    }
}

module.exports = confluenceApi;
