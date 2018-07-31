/* eslint-env node, es6 */

const { task, src, parallel, series } = require('gulp');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const htmllint = require('gulp-htmllint');
const surge = require('gulp-surge');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const logger = require('gulplog');

task('lint:scripts', () =>
  src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

task('lint:styles', () =>
  src('src/**/*.s[ac]ss')
    .pipe(stylelint({
      failAfterError: true,
      reporters: [{
        formatter: 'string',
        console: true,
      }],
    })));

// TODO: find a way to lint the HTML inside JS template literals, as currently we are linting only index.html
task('lint:templates', () =>
  src('src/**/*.{html,hbs}')
    .pipe(htmllint({
      failOnError: true,
    })));

task('lint', parallel('lint:scripts', 'lint:styles', 'lint:templates'));

task('deploy:surge', () => surge({
  project: 'build',
  domain: 'steganography-toolkit.surge.sh',
}));

task('wait', () => new Promise((resolve) => setTimeout(resolve, 3000)));

task('lighthouse', () =>
  chromeLauncher.launch({
    chromeFlags: ['--headless'],
  }).then((chrome) =>
    lighthouse('https://steganography-toolkit.surge.sh', {
      port: chrome.port,
    }).then((results) => chrome.kill().then(() => {
      delete results.artifacts;
      const { audits } = JSON.parse(results.report);
      const unsuccessfulAudits = Object.values(audits).filter(({ score }) => score && score < .85);
      if (unsuccessfulAudits.length > 0) {
        // eslint-disable-next-line no-console
        console.error(unsuccessfulAudits.reduce((str, audit) =>
          `${str}- ${audit.id}: ${audit.displayValue}\n`, '\nSome audits were not successful:\n\n'));
        return Promise.reject(unsuccessfulAudits);
      } else {
        // eslint-disable-next-line no-console
        console.log('\nAll audits passed successfully!\n');
        return Promise.resolve(audits);
      }
    }))));

task('test-scores', series('deploy:surge', 'wait', 'lighthouse'));
