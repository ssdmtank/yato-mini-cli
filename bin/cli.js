#!/usr/bin/env node
'use strict';

var ora = require('ora');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);

var name = "yato-mini-cli";
var version = "0.0.1";
var description = "taro min ci";
var main = "lib/index.js";
var bin = {
	"yato-mini-cli": "./bin/cli.js"
};
var scripts = {
	dev: "rollup -w -c",
	build: "rollup -c"
};
var engines = {
	node: ">=v12"
};
var repository = {
	type: "git",
	url: "git+https://github.com/ssdmtank/yato-mini-cli.git"
};
var author = "King Win";
var license = "MIT";
var bugs = {
	url: "https://github.com/ssdmtank/yato-mini-cli/issues"
};
var homepage = "https://github.com/ssdmtank/yato-mini-cli#readme";
var keywords = [
	"gitlab",
	"wechat",
	"miniprogram",
	"taro",
	"ci",
	"deploy"
];
var dependencies = {
	commander: "^9.0.0",
	"miniprogram-ci": "^1.8.0",
	ora: "^5.0.0"
};
var devDependencies = {
	"@rollup/plugin-json": "^4.1.0",
	rollup: "^2.68.0"
};
var packageJson = {
	name: name,
	version: version,
	description: description,
	main: main,
	bin: bin,
	scripts: scripts,
	engines: engines,
	repository: repository,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	keywords: keywords,
	dependencies: dependencies,
	devDependencies: devDependencies
};

/**
 * 打包判断
 * @param {*} cmdOpt
 */
const deploy = (cmdOpt) => {
  console.log('de', cmdOpt);
  const spinner = ora__default["default"]('Loading unicorns').start();

  setTimeout(() => {
    spinner.color = 'yellow';
    spinner.text = 'Loading rainbows';
  }, 1000);
  spinner.succeed();
  spinner.fail();
  spinner.warn();
  spinner.info();
};

const { Command } = require('commander');

const program = new Command();
program.version(packageJson.version, '-v, --version', '输出当前版本号').helpOption('-h, --help', '查看帮助信息');

program
  .command('deploy')
  .option('--env [value]', '环境类型')
  .option('--ver [value]', '发布版本号')
  .option('--desc [value]', '发布简介')
  .description('发布小程序')
  .action(function (cmdOpt) {
    deploy(cmdOpt);
  });

program.parse(process.argv);
