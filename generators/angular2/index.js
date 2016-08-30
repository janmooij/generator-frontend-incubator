'use strict';
const yo = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const config = require('./config.json');

module.exports = yo.Base.extend({

    constructor: function (arg, options) {
        yo.Base.apply(this, arguments);

		this.settings = config;
	},

    writing: function () {
		const props = this.options.props;

        this.fs.copyTpl(
            this.templatePath('src/prototype/index.html'),
            this.destinationPath('bla/index.html'),
            { title: 'Templating with Yeoman' }
        );

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            {
                name: props.projectName,
                version: props.projectVersion
            }
        );

		this.fs.copyTpl(
			this.templatePath('_config.json'),
			this.destinationPath('config.json'),
			{
				paths: this.settings.paths,
				esVersion: props.es2015orLoose ? 'es2015-loose' : 'es2015',
				ftp: {
					host: props.ftpHost || '',
					user: props.ftpUser || '',
					pass: props.ftpPass || ''
				}
			}
		);

        this.fs.copyTpl(
            this.templatePath('_README.md'),
            this.destinationPath('README.md'),
            {
                name: props.projectName,
                itcss: props.itcss
            }
        );

        let simpleCopyFiles = ['.editorconfig', '.gitattributes', '.gitignore', '.jshintrc', 'gulpfile.js', 'tasks.json'];
        if (props.useSasslint) {
            simpleCopyFiles.push('.sass-lint.yml');
        }

        for (let i = 0; i < simpleCopyFiles.length; i++) {
            this.fs.copyTpl(
                this.templatePath('_' + simpleCopyFiles[i]),
                this.destinationPath(simpleCopyFiles[i]),
                {
                    useSasslint: props.useSasslint
                }
            );
        }

        let paths = this.settings.paths.src,
            keep = '/.keep',
            keepText = 'remove this file when you\'ve added content to this folder',
            stylePath = paths.asset.scss;

        this.fs.write(paths.asset.image + keep, keepText);
        this.fs.write(paths.asset.font + keep, keepText);

        if (props.itcss) {
            this.fs.copy(this.templatePath('src/asset/scss/settings/_settings.scss'), this.destinationPath(stylePath + '/settings/_settings.scss'));
            this.fs.copy(this.templatePath('src/asset/scss/tools/_tools.scss'), this.destinationPath(stylePath + '/tools/_tools.scss'));
            this.fs.copy(this.templatePath('src/asset/scss/generic/_generic.scss'), this.destinationPath(stylePath + '/generic/_generic.scss'));
            this.fs.copy(this.templatePath('src/asset/scss/base/_base.scss'), this.destinationPath(stylePath + '/base/_base.scss'));
            this.fs.copy(this.templatePath('src/asset/scss/components/_components.scss'), this.destinationPath(stylePath + '/components/_components.scss'));
            this.fs.copy(this.templatePath('src/asset/scss/theme/_theme.scss'), this.destinationPath(stylePath + '/theme/_theme.scss'));
            this.fs.copy(this.templatePath('src/asset/scss/trumps/_trumps.scss'), this.destinationPath(stylePath + '/trumps/_trumps.scss'));
            this.fs.copy(this.templatePath('src/asset/scss/itcss.scss'), this.destinationPath(stylePath + '/site.scss'));
        } else {
            this.fs.copy(this.templatePath('src/asset/scss/site.scss'), this.destinationPath(stylePath + '/site.scss'));
        }

        this.bulkDirectory(paths.prototype.template, paths.prototype.template);
        this.fs.write(paths.prototype.data + keep, keepText);
        this.fs.write(paths.prototype.webroot + keep, keepText);
    }
});
