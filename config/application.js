module.exports = function(lineman) {
  return {
    concat_sourcemap: {
      js: {
        src: ["<%= files.template.generated %>", "<%= files.coffee.generated %>", "<%= files.js.app %>"],
        dest: "<%= files.js.concatenated %>",
        options: {
          banner: "<%= meta.banner %>"
        }
      },
      jsVendor: {
        src: ["<%= files.js.vendor %>"],
        dest: "<%= files.js.concatenatedVendor %>"
      }
    },

    uglify: {
      jsVendor: {
        files: {
          "<%= files.js.minifiedVendor %>": "<%= files.js.concatenatedVendor %>"
        }
      }
    },

    jade: {
      pagesDev: {
        options: {
          data: {
            jsVendor: "js/vendor.js"
          }
        }
      },
      pagesDist: {
        options: {
          data: {
            jsVendor: "js/vendor.js"
          }
        }
      }
    },

    watch: {
      less: {
        files: [
          "<%= files.less.vendor %>",
          "<%= files.less.app %>",
          "<%= files.less.watch %>"
        ]
      }
    },

    webfonts: {
      files: {
        "vendor/components/bootstrap/fonts/": "vendor/components/bootstrap/fonts/**/*",
        "vendor/components/font-awesome/fonts/": "vendor/components/font-awesome/fonts/**/*.*"
      }
    },
/*
    server: {
      pushState: true,
      apiProxy: {
        enabled: true,
        host: '192.168.56.102',
        port: 3030,
        prefix: 'api'
      }
    }
*/
    server: {
      pushState: true,
      apiProxy: {
        enabled: true,
        host: 'localhost',
        port: 3030,
        prefix: 'api'
      }
    }
  };
};
