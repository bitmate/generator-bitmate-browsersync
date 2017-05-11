const test = require('ava');

let browsersyncConf;

test.before(() => {
  browsersyncConf = require('../../../generators/app/conf');
});

test(`browsersyncConf when server is express`, t => {
  const templateVars = {server: 'express'};
  const expected = {
    proxy: 'http://localhost:9000',
    port: 7000,
    files: ['lit>>conf.paths.tmp<<lit', 'lit>>conf.paths.client<<lit'],
    open: false
  };
  const result = browsersyncConf(templateVars);
  t.deepEqual(result, expected);
});

test(`browsersyncConf when server is express and dist is true`, t => {
  const templateVars = {server: 'express', dist: true};
  const expected = {
    proxy: 'http://localhost:8080',
    port: 7000,
    files: ['lit>>conf.path.dist(\'client\')<<lit'],
    open: false
  };
  const result = browsersyncConf(templateVars);
  t.deepEqual(result, expected);
});

test(`browsersyncConf when server is express and modules is 'systemjs'`, t => {
  const templateVars = {server: 'express', modules: 'systemjs'};
  const expected = {
    proxy: 'http://localhost:9000',
    port: 7000,
    files: ['lit>>conf.paths.client<<lit', 'lit>>conf.paths.tmp<<lit'],
    open: false
  };
  const result = browsersyncConf(templateVars);
  t.deepEqual(result, expected);
});

test(`browsersyncConf when server is express and modules is 'webpack' and webpackHotReload is true`, t => {
  const templateVars = {server: 'express', webpackHotReload: true, modules: 'webpack'};
  const expected = {
    proxy: 'http://localhost:9000',
    port: 7000,
    files: ['lit>>conf.paths.tmp<<lit', 'lit>>conf.paths.client<<lit'],
    middleware: [
      `lit>>webpackDevMiddleware(webpackBundler, {
      // IMPORTANT: dev middleware can't access config, so we should
      // provide publicPath by ourselves
      publicPath: webpackConf.output.publicPath,

      // Quiet verbose output in console
      quiet: true
    }),

    // bundler should be the same as above
    webpackHotMiddleware(webpackBundler)<<lit`
    ],
    open: false
  };
  const result = browsersyncConf(templateVars);
  t.deepEqual(result, expected);
});

test(`browsersyncConf when dist is true`, t => {
  const templateVars = {dist: true};
  const expected = {
    server: {
      baseDir: ['lit>>conf.paths.dist<<lit']
    },
    open: false
  };
  const result = browsersyncConf(templateVars);
  t.deepEqual(result, expected);
});

test(`browsersyncConf when modules is 'bower'`, t => {
  const templateVars = {modules: 'bower'};
  const expected = {
    server: {
      baseDir: ['lit>>conf.paths.tmp<<lit', 'lit>>conf.paths.client<<lit'],
      routes: {
        '/bower_components': 'bower_components'
      }
    },
    open: false
  };
  const result = browsersyncConf(templateVars);
  t.deepEqual(result, expected);
});

test(`browsersyncConf when modules is 'systemjs'`, t => {
  const templateVars = {modules: 'systemjs'};
  const expected = {
    server: {
      baseDir: ['lit>>conf.paths.client<<lit', 'lit>>conf.paths.tmp<<lit'],
      routes: {
        '/jspm_packages': 'jspm_packages',
        '/jspm.config.js': 'jspm.config.js',
        '/jspm.browser.js': 'jspm.browser.js',
        '/client': 'client'
      }
    },
    open: false
  };
  const result = browsersyncConf(templateVars);
  t.deepEqual(result, expected);
});

test(`browsersyncConf when modules is 'webpack'`, t => {
  const templateVars = {modules: 'webpack'};
  const expected = {
    server: {
      baseDir: ['lit>>conf.paths.tmp<<lit', 'lit>>conf.paths.client<<lit']
    },
    open: false
  };
  const result = browsersyncConf(templateVars);
  t.deepEqual(result, expected);
});

test(`browsersyncConf when modules is 'webpack' and webpackHotReload is true`, t => {
  const templateVars = {webpackHotReload: true, modules: 'webpack'};
  const expected = {
    server: {
      baseDir: ['lit>>conf.paths.tmp<<lit', 'lit>>conf.paths.client<<lit'],
      middleware: [`lit>>webpackDevMiddleware(webpackBundler, {
        // IMPORTANT: dev middleware can't access config, so we should
        // provide publicPath by ourselves
        publicPath: webpackConf.output.publicPath,

        // Quiet verbose output in console
        quiet: true
      }),

      // bundler should be the same as above
      webpackHotMiddleware(webpackBundler)<<lit`]
    },
    open: false
  };
  const result = browsersyncConf(templateVars);
  t.deepEqual(result, expected);
});
