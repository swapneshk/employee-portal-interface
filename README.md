A Lineman JS APP.

1) Changes made in -> app/templates/dashboard.jade.
For the brevity of script inclusion I included an html file instead of jade template to dashboard.

2) Run the lineman and navigate to http://localhost:8000/dashboard

3) Images are going this time although scripts are not including as I need to include scripts present in the plugin folder which resides at -
    -> vendor/plugins.
    
4) For the change I added plugins at config/files.js-
    plugins: [
      "vendor/plugins/**/*.js"
    ],
    
    To find plugins files.
    
5) In test.html I added the scripts at last like - <script src="/plugins/mandatoryJs.min.js"></script>

However they are breaking when compiling into a vendor.js.