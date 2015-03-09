module.exports = function(lineman) {
  return {
    copy : {
      main :{
        files:[{
        nonull: true,
        expand: true,
        src : "vendor/theme/assets/css/plugins.css",
        dest : "generated/"
        }]
      }
    }
  };
};