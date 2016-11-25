#!/usr/bin/env node

const program = require('commander');
const co = require('co');
const prompt = require('co-prompt');
const utils = require('./utils');
const confluenceApi = require('./confluenceApi');
const {
  buildContent,
  getBindings
} = require('./utils');

const testParentId = '23040538';

program.version('0.0.1')
.option('-u, --username <username>', 'The user to authenticate as')
.option('-t, --template <template>', 'The parent template\'s ID')
.option('-s, --space <space>', 'The space\'s key')
.parse(process.argv);

co(function *() {
  const username = program.username || (yield prompt('Username: '));
  const password = yield prompt.password('password: ');
  const parentId = program.template || (yield prompt('Parent Template ID: '));
  const spaceKey = program.space || (yield prompt('Space key: '));
  const api = new confluenceApi(username, password);

  try {
    const childs = yield api.getChilds(parentId);
    const childsIds = childs.results.map((child) => child.id);
    const getAllPages = [parentId]
      .concat(childsIds)
      .map( (id) => api.getTemplate(id) );
    const allPages = yield getAllPages;
    const templates = allPages.map((page) => ({
      body: page.body.storage.value,
      title: page.title
    }));
    console.log(JSON.stringify(templates));
    const newPages = [];
    for (let template of templates) {
      const bndArr = getBindings(template.body);
      const bindings = {};
      console.log(`\nEnter values for template '${template.title}':\n`)
      for (let binding of bndArr) {
        const val = yield prompt(`--> Insert ${binding} value: `);
        bindings[binding] = val;
      }
      const title = yield prompt('--> Insert new Page title: ');
      const page = buildContent(bindings, template.body);
      newPages.push({title, page});
    }
    const newParentPage = yield api.createNewPage(newPages[0].title, spaceKey, newPages[0].page, testParentId)
    const postChildPages = newPages.slice(1)
      .map( ({title, page}, i) => api.createNewPage(title, spaceKey, page, newParentPage.id) );
    const postResponses = (yield postChildPages).concat(newParentPage);
    postResponses.forEach((res) => console.log(`\n'${res.title}' created:\n ${res.body.storage.value}`));
  } catch (e) {
    console.log(`Something went wrong:\n ${e.stack}`)
  }

  process.stdin.pause();
});
