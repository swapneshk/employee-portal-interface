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
        "vendor/components/angular-multi-select/angular-multi-select.js",
        "vendor/components/socket.io-client/socket.io.js",
        /*
        "vendor/theme/assets/plugins/jquery-1.11.js",
        "vendor/theme/assets/plugins/jquery-migrate-1.2.1.js",
        "vendor/theme/assets/plugins/jquery-ui/jquery-ui-1.10.4.min.js",
        "vendor/theme/assets/plugins/bootstrap/bootstrap.min.js",
        "vendor/theme/assets/plugins/mmenu/js/jquery.mmenu.min.all.js",
        "vendor/theme/assets/plugins/fullcalendar/moment.min.js",
        "vendor/theme/assets/plugins/fullcalendar/fullcalendar.min.js",
        "vendor/theme/assets/js/calendar.js",
        "vendor/theme/assets/js/application.js"
        */
        /*
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
        */
        /*
        "vendor/plugins/mandatoryJs.min.js",
        "vendor/plugins/metrojs/metrojs.min.js",
        "vendor/plugins/fullcalendar/moment.min.js",
        "vendor/plugins/fullcalendar/fullcalendar.min.js",
        "vendor/plugins/simple-weather/jquery.simpleWeather.min.js",
        "vendor/plugins/charts-flot/jquery.flot.js",
        "vendor/plugins/charts-flot/jquery.flot.animator.min.js",
        "vendor/plugins/charts-flot/jquery.flot.resize.js",
        "vendor/plugins/charts-flot/jquery.flot.time.min.js",
        "vendor/plugins/charts-morris/raphael.min.js",
        "vendor/plugins/charts-morris/morris.min.js",
        "vendor/plugins/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js",
        "vendor/js/calendar.js",
        "vendor/js/dashboard.js",
        "vendor/js/application.js"
        */

        //"vendor/js/**/*.js"
      ],
      app: [
        "app/js/app.js",
        "app/js/**/*.js"
      ],
      /*
      plugin: [
        "vendor/modernizr/modernizr-2.6.2-respond-1.1.0.min.js",
        "vendor/plugins/mandatoryJs.min.js",
        "vendor/plugins/metrojs/metrojs.min.js",
        "vendor/plugins/fullcalendar/moment.min.js",
        "vendor/plugins/fullcalendar/fullcalendar.min.js",
        "vendor/plugins/simple-weather/jquery.simpleWeather.min.js",
        "vendor/plugins/charts-flot/jquery.flot.js",
        "vendor/plugins/charts-flot/jquery.flot.animator.min.js",
        "vendor/plugins/charts-flot/jquery.flot.resize.js",
        "vendor/plugins/charts-flot/jquery.flot.time.min.js",
        "vendor/plugins/charts-morris/raphael.min.js",
        "vendor/plugins/charts-morris/morris.min.js",
        "vendor/plugins/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js",
        "vendor/js/calendar.js",
        "vendor/js/dashboard.js",
        "vendor/js/application.js"
      ],
      */
      concatenatedVendor: "generated/js/vendor.js",
      minifiedVendor: "dist/js/vendor.js",
      //concatenatedPlugin: "generated/js/plugin.js",
      //minifiedPlugin: "dist/js/plugin.js"
    },

    css: {
      vendor: [
        
        "vendor/components/toastr/toastr.css",
        "vendor/components/bootstrap-datepicker/css/datepicker3.css",
        "vendor/components/angular-busy/dist/angular-busy.css",
        "vendor/components/angular-multi-select/angular-multi-select.css",
        
        /*
        "vendor/css/icons/icons.min.css",
        "vendor/css/bootstrap.min.css",
        "vendor/css/plugins.min.css",
        "vendor/css/style.css",
        "vendor/fullcalendar/fullcalendar.css",
        "vendor/metrojs/metrojs.css"
        */
      ],
      /*
      themecss: [
        "vendor/theme/assets/css/style.css"
      ],
      concatenatedTheme: "generated/assets/themecss.css"
      */
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
