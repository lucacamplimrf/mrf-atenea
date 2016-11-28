const ConfluenceApi = require('../confluenceApi');
const rq = require('request-promise');
const auth = require('../auth');
const api = new ConfluenceApi(auth.username, auth.password);

const getIdByTitle = (title, spaceKey) => {
    return rq({
            uri: 'https://atenea.marfeel.com/rest/api/content',
            qs: {
                title,
                spaceKey
            },
            auth,
            json: true
        })
        .then(res => res.results[0] ? res.results[0].id : '');
};

const deleteTestPages = (title, spaceKey) => {
    getIdByTitle(title, spaceKey)
        .then(id => Promise.all([api.getChilds(id), id]))
        .then(ids => {
            ids.forEach(id => {
                return rq({
                    method: 'DELETE',
                    uri: `https://atenea.marfeel.com/rest/api/content/${id}`,
                    auth,
                    json: true
                });
            })
        })
};


module.exports = {
    deleteTestPages,
    getIdByTitle
};
