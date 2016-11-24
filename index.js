#!/usr/bin/env node

const rq = require('request-promise');
const program = require('commander');
const co = require('co');
const prompt = require('co-prompt');
const utils = require('./utils');

program.version('0.0.1')
.option('-u, --username <username>', 'The user to authenticate as')
.option('-t, --template <template>', 'The template\'s ID')
.option('-s, --space <space>', 'The space\'s key')
.option('-n, --title <title>', 'The page\'s title')
.parse(process.argv);

co(function *() {
  const username = program.username || (yield prompt('Username: '));
  const password = yield prompt.password('password: ');
  const templateId = program.template || (yield prompt('Template ID: '));
  const space = program.space || (yield prompt('Space key: '));
  const title = program.title || (yield prompt('Page title: '));

  try {
    const res = yield rq(utils.getTemplate(username, password, templateId));
    const template = res.body.storage.value;
    const bndArr = utils.getBindings(template);
    const bindings = {};
    for (let i = 0; i < bndArr.length; i++) {
      const binding = bndArr[i];
      const val = yield prompt(`Insert ${binding} value: `);
      bindings[binding] = val;
    }
    const page = utils.buildContent(bindings, template);
    const postNewPage = utils.createNewPage(username, password, title, space, page);
    const postRes = yield rq(postNewPage);
    console.log(`Page created:\n ${postRes.body.storage.value}`);
  } catch (e) {
    console.log(`Something went wrong:\n ${e.stack}`)
  }

  process.stdin.pause();
});
