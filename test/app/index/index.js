const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const Utils = require('@oligibson/bitmate-generator').TestUtils;

let context;

test.before(() => {
  context = Utils.mock('app');
  require('../../../generators/app/index');
  process.chdir('../../../');
});

test(`Add 'browser-sync' and 'browser-sync-spa' to package.json devDependencies`, t => {
  Utils.call(context, 'configuring.package');
  t.is(context.mergeJson['package.json'].devDependencies['browser-sync'], '^2.9.11');
  t.is(context.mergeJson['package.json'].devDependencies['browser-sync-spa'], '^1.0.3');
});

test(`Call 'copyTemplate' twice and copy the files`, t => {
  const spy = chai.spy.on(context, 'copyTemplate');
  context.options = {
    client: 'react',
    modules: 'webpack'
  };
  Utils.call(context, 'configuring.conf');
  expect(spy).to.have.been.called.twice();
  t.true(context.copyTemplate['conf/browsersync.conf.js'].length > 0);
  t.true(context.copyTemplate['conf/browsersync-dist.conf.js'].length > 0);
});

test('Copy browsersync.js', t => {
  Utils.call(context, 'writing');
  t.true(context.copyTemplate['gulp_tasks/browsersync.js'].length > 0);
});
