const { task, src, parallel } = require('gulp');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const htmllint = require('gulp-htmllint');
const surge = require('gulp-surge');

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
  src('src/**/*.html')
    .pipe(htmllint({
      failOnError: true,
    })));

task('lint', parallel('lint:scripts', 'lint:styles', 'lint:templates'));

task('deploy:surge', () => surge({
  project: 'build',
  domain: 'steganography-toolkit.surge.sh',
}));
