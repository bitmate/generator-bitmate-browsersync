/* eslint func-names: 0 */  // --> OFF

const lit = require('@oligibson/bitmate-generator').lit;

module.exports = function browsersyncConf(templateVars) {
  const conf = {
    open: false
  };

  if (templateVars.server === 'express') {
    conf.port = 7000;
    conf.files = [];

    if (templateVars.dist) {
      conf.proxy = 'http://localhost:8080';
      conf.files.push(lit`conf.path.dist('client')`);
    } else {
      conf.proxy = 'http://localhost:9000';
      conf.files.push(lit`conf.paths.tmp`);
      if (templateVars.modules === 'systemjs') {
        conf.files.unshift(lit`conf.paths.client`);
      } else {
        conf.files.push(lit`conf.paths.client`);
      }
      if (templateVars.webpackHotReload) {
        conf.middleware = [
          lit`webpackDevMiddleware(webpackBundler, {
      // IMPORTANT: dev middleware can't access config, so we should
      // provide publicPath by ourselves
      publicPath: webpackConf.output.publicPath,

      // Quiet verbose output in console
      quiet: true
    }),

    // bundler should be the same as above
    webpackHotMiddleware(webpackBundler)`
        ];
      }
    }
  } else {
    conf.server = {
      baseDir: []
    };

    if (templateVars.dist) {
      conf.server.baseDir.push(lit`conf.paths.dist`);
    } else {
      conf.server.baseDir.push(lit`conf.paths.tmp`);
      if (templateVars.modules === 'systemjs') {
        conf.server.baseDir.unshift(lit`conf.paths.client`);
      } else {
        conf.server.baseDir.push(lit`conf.paths.client`);
      }
      if (templateVars.modules === 'bower') {
        conf.server.routes = {
          '/bower_components': 'bower_components'
        };
      }
      if (templateVars.modules === 'systemjs') {
        conf.server.routes = {
          '/jspm_packages': 'jspm_packages',
          '/jspm.config.js': 'jspm.config.js',
          '/jspm.browser.js': 'jspm.browser.js',
          '/client': 'client'
        };
      }
      if (templateVars.webpackHotReload) {
        conf.server.middleware = [
          lit`webpackDevMiddleware(webpackBundler, {
        // IMPORTANT: dev middleware can't access config, so we should
        // provide publicPath by ourselves
        publicPath: webpackConf.output.publicPath,

        // Quiet verbose output in console
        quiet: true
      }),

      // bundler should be the same as above
      webpackHotMiddleware(webpackBundler)`
        ];
      }
    }
  }

  return conf;
};
