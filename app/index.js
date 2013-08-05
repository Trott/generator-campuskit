'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var ncp = require('ncp').ncp;
var async = require('async');

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
  console.log('Out of the box I include HTML5 Mobile Boilerplate, FastClick, Zepto, Modernizr, and Normalize.css.');

  var prompts = [
    // {
    //   type: 'confirm',
    //   name: 'someOption',
    //   message: 'Would you like to enable this option?',
    //   default: true
    // }
    {
      name: 'siteName',
      message: 'What would you like to name your site?',
      default: 'My site'
    },
    {
      name: 'description',
      message: 'Provide a brief description of the site.',
      default: 'An awesome CampusKit site.'
    },
    {
      name: 'gaid',
      message: 'If you know your Google Analytics code, enter it.',
      default: 'UA-XXXXX-X'
    }
  ];

  this.prompt(prompts, function (props) {
    this.siteName = props.siteName;
    this.slugSiteName = this.siteName.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    this.description = props.description;

    this.gaid = props.gaid;

    cb();
  }.bind(this));
};

CampuskitGenerator.prototype.getCampusKit = function getCampusKit() {
  var cb = this.async();

  this.bowerInstall('campuskit', {}, function (err) {
    if (err) {
      return cb(err);
    }

    async.parallel(
      [
        function (callback) {
          ncp('bower_components/CampusKit/bower.json', 'bower.json', callback);
        },
        function (callback) {
          ncp('bower_components/CampusKit/package.json', 'package.json', callback);
        },
        function (callback) {
          ncp('bower_components/CampusKit/phonegap', 'phonegap', callback);
        },
        function (callback) {
          ncp('bower_components/CampusKit/sites', 'sites', callback);
        },
        function (callback) {
          ncp('bower_components/CampusKit/src', 'src', callback);
        }
      ], cb);
  });
};

CampuskitGenerator.prototype.h5bpm = function h5bpm() {
  this.template('index.html', 'sites/' + this.slugSiteName + '/html/index.html');
  this.template('Gruntfile.js', 'Gruntfile.js');

  this.copy('apple-touch-icon-114x114-precomposed.png',
    'sites/' + this.slugSiteName + '/img/touch/apple-touch-icon-114x114-precomposed.png');
  this.copy('apple-touch-icon-114x114-precomposed.png',
    'sites/' + this.slugSiteName + '/img/touch/apple-touch-icon-144x144-precomposed.png');
  this.copy('apple-touch-icon-114x114-precomposed.png',
    'sites/' + this.slugSiteName + '/img/touch/apple-touch-icon-57x57-precomposed.png');
  this.copy('apple-touch-icon-114x114-precomposed.png',
    'sites/' + this.slugSiteName + '/img/touch/apple-touch-icon-72x72-precomposed.png');
  this.copy('apple-touch-icon-114x114-precomposed.png',
    'sites/' + this.slugSiteName + '/img/touch/apple-touch-icon-precomposed.png');
  this.copy('apple-touch-icon-114x114-precomposed.png',
    'sites/' + this.slugSiteName + '/img/touch/apple-touch-icon.png');
  this.copy('main.css',
    'sites/' + this.slugSiteName + '/css/main.css');
  this.copy('normalize.css',
    'sites/' + this.slugSiteName + '/css/normalize.css');
  this.copy('modernizr-2.6.2.min.js',
    'sites/' + this.slugSiteName + '/js/modernizr-2.6.2.min.js');
  this.copy('zepto.min.js',
    'sites/' + this.slugSiteName + '/js/zepto.min.js');
  this.copy('helper.src.js',
    'sites/' + this.slugSiteName + '/js/helper.src.js');
};

CampuskitGenerator.prototype.phonegap = function phonegap() {
  this.directory('phonegap',
    'phonegap/campuskit_templates/' + this.slugSiteName);
};

CampuskitGenerator.prototype.app = function app() {
  this.mkdir('sites/' + this.slugSiteName);
  var dirs = ['html', 'css', 'js', 'img'];
  for (var index in dirs) {
    this.mkdir('sites/' + this.slugSiteName + '/' + dirs[index]);
  }
};