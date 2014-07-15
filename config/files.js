/* Exports a function which returns an object that overrides the default &
 *   plugin file patterns (used widely through the app configuration)
 *
 * To see the default definitions for Lineman's file paths and globs, see:
 *
 *   - https://github.com/linemanjs/lineman/blob/master/config/files.coffee
 */
module.exports = function(lineman) {
  //Override file patterns here
  return {
    js: {
      vendor: [
        "vendor/components/jquery/dist/jquery.js",
        "vendor/components/bootstrap/dist/js/bootstrap.js",
        "vendor/components/underscore/underscore.js",
        "vendor/components/toastr/toastr.js",
        "vendor/components/moment/moment.js",
        "vendor/components/bootstrap-datepicker/js/bootstrap-datepicker.js",
        "vendor/components/jquery-maskedinput/dist/jquery.maskedinput.js",

        "vendor/components/angular/angular.js",
        "vendor/components/angular-sanitize/angular-sanitize.js",
        "vendor/components/angular-route/angular-route.js",
        "vendor/components/angular-resource/angular-resource.js",
        "vendor/components/angular-moment/angular-moment.js",
        
        "vendor/components/nprogress/nprogress.js",
        "vendor/components/moment/moment.js",
        "vendor/components/fullcalendar/fullcalendar.min.js",
        "vendor/components/simpleWeather/jquery.simpleWeather.min.js",
        "vendor/components/flot/jquery.flot.js",
        "vendor/components/flot/jquery.flot.resize.js",
        "vendor/components/flot/jquery.flot.time.min.js",
        "vendor/components/raphael/raphael-min.js",
        "vendor/components/morrisjs/morris.min.js",
        "vendor/components/jqueryui-touch-punch/jquery.ui.touch-punch.min.js",
        "vendor/components/modernizr/modernizr.js",

        "vendor/js/**/*.js"
      ],
      app: [
        "app/js/app.js",
        "app/js/**/*.js"
      ],
      plugins: [
        "vendor/plugins/**/*.js"
      ],
      concatenatedVendor: "generated/js/vendor.js",
      minifiedVendor: "dist/js/vendor.js"
    },

    css: {
      vendor: [
        "vendor/components/toastr/toastr.css",
        "vendor/components/bootstrap-datepicker/css/datepicker3.css",
      ]
    },

    less: {
      app: "app/css/app.less",
      watch: "app/css/**/*.less"
    },

    webfonts: {
      root: "fonts"
    }

  };
};
