'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fluentFfmpeg = require('fluent-ffmpeg');

var _fluentFfmpeg2 = _interopRequireDefault(_fluentFfmpeg);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class ThumbnailGenerator
 */
var ThumbnailGenerator = function () {

  /**
   * @constructor
   *
   * @param {String} [opts.sourcePath] - 'full path to video file'
   * @param {String} [opts.thumbnailPath] - 'path to where thumbnail(s) should be saved'
   * @param {Number} [opts.percent]
   * @param {String} [opts.size]
   * @param {Logger} [opts.logger]
   */
  function ThumbnailGenerator(opts) {
    _classCallCheck(this, ThumbnailGenerator);

    this.sourcePath = opts.sourcePath;
    this.thumbnailPath = opts.thumbnailPath;
    this.percent = opts.percent + '%' || '90%';
    this.logger = opts.logger || null;
    this.size = opts.size || '320x240';
    this.fileNameFormat = '%b-thumbnail-%r-%000i';
    this.tmpDir = opts.tmpDir || '/tmp';

    // by include deps here, it is easier to mock them out
    this.FfmpegCommand = _fluentFfmpeg2.default;
    this.del = _del2.default;
  }

  /**
   * @method getFfmpegInstance
   *
   * @return {FfmpegCommand}
   *
   * @private
   */


  _createClass(ThumbnailGenerator, [{
    key: 'getFfmpegInstance',
    value: function getFfmpegInstance() {
      return new this.FfmpegCommand({
        source: this.sourcePath,
        logger: this.logger
      });
    }

    /**
     * Method to generate one thumbnail by being given a percentage value.
     *
     * @method generateOneByPercent
     *
     * @param {Number} percent
     * @param {String} [opts.folder]
     * @param {String} [opts.size] - 'i.e. 320x320'
     * @param {String} [opts.filename]
     *
     * @return {Promise}
     *
     * @public
     *
     * @async
     */

  }, {
    key: 'generateOneByPercent',
    value: function generateOneByPercent(percent, opts) {
      if (percent < 0 || percent > 100) {
        return _bluebird2.default.reject(new Error('Percent must be a value from 0-100'));
      }

      return this.generate(_lodash2.default.assignIn(opts, {
        count: 1,
        timestamps: [percent + '%']
      })).then(function (result) {
        return result.pop();
      });
    }

    /**
     * Method to generate one thumbnail by being given a percentage value.
     *
     * @method generateOneByPercentCb
     *
     * @param {Number} percent
     * @param {Object} [opts]
     * @param {Function} cb (err, string)
     *
     * @return {Void}
     *
     * @public
     *
     * @async
     */

  }, {
    key: 'generateOneByPercentCb',
    value: function generateOneByPercentCb(percent, opts, cb) {
      var callback = cb || opts;

      this.generateOneByPercent(percent, opts).then(function (result) {
        return callback(null, result);
      }).catch(callback);
    }

    /**
     * Method to generate thumbnails
     *
     * @method generate
     *
     * @param {String} [opts.folder]
     * @param {Number} [opts.count]
     * @param {String} [opts.size] - 'i.e. 320x320'
     * @param {String} [opts.filename]
     *
     * @return {Promise}
     *
     * @public
     *
     * @async
     */

  }, {
    key: 'generate',
    value: function generate(opts) {
      var defaultSettings = {
        folder: this.thumbnailPath,
        count: 10,
        size: this.size,
        filename: this.fileNameFormat,
        logger: this.logger
      };

      var ffmpeg = this.getFfmpegInstance();
      var settings = _lodash2.default.assignIn(defaultSettings, opts);
      var filenameArray = [];

      return new _bluebird2.default(function (resolve, reject) {
        function complete() {
          resolve(filenameArray);
        }

        function filenames(fns) {
          filenameArray = fns;
        }

        ffmpeg.on('filenames', filenames).on('end', complete).on('error', reject).screenshots(settings);
      });
    }

    /**
     * Method to generate thumbnails
     *
     * @method generateCb
     *
     * @param {String} [opts.folder]
     * @param {Number} [opts.count]
     * @param {String} [opts.size] - 'i.e. 320x320'
     * @param {String} [opts.filename]
     * @param {Function} cb - (err, array)
     *
     * @return {Void}
     *
     * @public
     *
     * @async
     */

  }, {
    key: 'generateCb',
    value: function generateCb(opts, cb) {
      var callback = cb || opts;

      this.generate(opts).then(function (result) {
        return callback(null, result);
      }).catch(callback);
    }

    /**
     * Method to generate the palette from a video (required for creating gifs)
     *
     * @method generatePalette
     *
     * @param {string} [opts.videoFilters]
     * @param {string} [opts.offset]
     * @param {string} [opts.duration]
     * @param {string} [opts.videoFilters]
     *
     * @return {Promise}
     *
     * @public
     */

  }, {
    key: 'generatePalette',
    value: function generatePalette(opts) {
      var ffmpeg = this.getFfmpegInstance();
      var defaultOpts = {
        videoFilters: 'fps=10,scale=320:-1:flags=lanczos,palettegen'
      };
      var conf = _lodash2.default.assignIn(defaultOpts, opts);
      var inputOptions = ['-y'];
      var outputOptions = ['-vf ' + conf.videoFilters];
      var output = this.tmpDir + '/palette-' + Date.now() + '.png';

      return new _bluebird2.default(function (resolve, reject) {
        function complete() {
          resolve(output);
        }

        if (conf.offset) {
          inputOptions.push('-ss ' + conf.offset);
        }

        if (conf.duration) {
          inputOptions.push('-t ' + conf.duration);
        }

        ffmpeg.inputOptions(inputOptions).outputOptions(outputOptions).on('end', complete).on('error', reject).output(output).run();
      });
    }
    /**
     * Method to generate the palette from a video (required for creating gifs)
     *
     * @method generatePaletteCb
     *
     * @param {string} [opts.videoFilters]
     * @param {string} [opts.offset]
     * @param {string} [opts.duration]
     * @param {string} [opts.videoFilters]
     * @param {Function} cb - (err, array)
     *
     * @return {Promise}
     *
     * @public
     */

  }, {
    key: 'generatePaletteCb',
    value: function generatePaletteCb(opts, cb) {
      var callback = cb || opts;

      this.generatePalette(opts).then(function (result) {
        return callback(null, result);
      }).catch(callback);
    }

    /**
     * Method to create a short gif thumbnail from an mp4 video
     *
     * @method generateGif
     *
     * @param {Number} opts.fps
     * @param {Number} opts.scale
     * @param {Number} opts.speedMultiple
     * @param {Boolean} opts.deletePalette
     *
     * @return {Promise}
     *
     * @public
     */

  }, {
    key: 'generateGif',
    value: function generateGif(opts) {
      var ffmpeg = this.getFfmpegInstance();
      var defaultOpts = {
        fps: 0.75,
        scale: 180,
        speedMultiplier: 4,
        deletePalette: true
      };
      var conf = _lodash2.default.assignIn(defaultOpts, opts);
      var inputOptions = [];
      var outputOptions = ['-filter_complex fps=' + conf.fps + ',setpts=(1/' + conf.speedMultiplier + ')*PTS,scale=' + conf.scale + ':-1:flags=lanczos[x];[x][1:v]paletteuse'];
      var outputFileName = conf.fileName || 'video-' + Date.now() + '.gif';
      var output = this.thumbnailPath + '/' + outputFileName;
      var d = this.del;

      function createGif(paletteFilePath) {
        if (conf.offset) {
          inputOptions.push('-ss ' + conf.offset);
        }

        if (conf.duration) {
          inputOptions.push('-t ' + conf.duration);
        }

        return new _bluebird2.default(function (resolve, reject) {
          outputOptions.unshift('-i ' + paletteFilePath);

          function complete() {
            if (conf.deletePalette === true) {
              d.sync([paletteFilePath], {
                force: true
              });
            }
            resolve(output);
          }

          ffmpeg.inputOptions(inputOptions).outputOptions(outputOptions).on('end', complete).on('error', reject).output(output).run();
        });
      }

      return this.generatePalette().then(createGif);
    }

    /**
     * Method to create a short gif thumbnail from an mp4 video
     *
     * @method generateGifCb
     *
     * @param {Number} opts.fps
     * @param {Number} opts.scale
     * @param {Number} opts.speedMultiple
     * @param {Boolean} opts.deletePalette
     * @param {Function} cb - (err, array)
     *
     * @public
     */

  }, {
    key: 'generateGifCb',
    value: function generateGifCb(opts, cb) {
      var callback = cb || opts;

      this.generateGif(opts).then(function (result) {
        return callback(null, result);
      }).catch(callback);
    }
  }]);

  return ThumbnailGenerator;
}();

exports.default = ThumbnailGenerator;