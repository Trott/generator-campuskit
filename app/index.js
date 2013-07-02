'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');

var CampuskitGenerator = module.exports = function CampuskitGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CampuskitGenerator, yeoman.generators.Base);

CampuskitGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
    // {
    //   type: 'confirm',
    //   name: 'someOption',
    //   message: 'Would you like to enable this option?',
    //   default: true
    // }
    {
      name: 'siteName',
      message: 'What would you like to name your site?'
    }
  ];

  this.prompt(prompts, function (props) {
    this.siteName = props.siteName;
    this.slugSiteName = this.siteName.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    cb();
  }.bind(this));
};

CampuskitGenerator.prototype.getCampusKit = function getCampusKit() {
  var cb = this.async();
  // this.remote('trott', 'campuskit', 'v0.4.2', function (err, remote) {
  //     if (err) {
  //       return cb(err);
  //     }
  //     remote.copy('Gruntfile.js', 'Gruntfile.js');
  //     remote.copy('LICENSE', 'LICENSE');
  //     remote.copy('bower.json', 'bower.json');
  //     remote.copy('phonegap', 'phonegap');
  //     cb();
  //   }
  // );
  this.bowerInstall('campuskit', {}, function (err) {
    if (err) {
      return cb(err);
    }
    fs.renameSync('components/CampusKit/Gruntfile.js', 'Gruntfile.js');
    fs.renameSync('components/CampusKit/package.json', 'package.json');
    fs.renameSync('components/CampusKit/phonegap', 'phonegap');
    fs.renameSync('components/CampusKit/sites', 'sites');
    fs.renameSync('components/CampusKit/src', 'src');
    cb();
  });
};

CampuskitGenerator.prototype.app = function app() {
  this.mkdir('sites/' + this.slugSiteName);
  var dirs = ['html', 'css', 'js', 'img'];
  for (var index in dirs) {
    this.mkdir('sites/' + this.slugSiteName + '/' + dirs[index]);
  }

  this.copy('_bower.json', 'bower.json');
};
