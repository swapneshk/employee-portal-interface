var nodemailer = require('nodemailer');
/*
// create reusable transporter object using SMTP transport
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "testteam.e37@gmail.com",
        pass: "testing@2012"
    }
});
*/
module.exports = {
  drawRoutes: function(app) {
    
  app.set('view engine', 'jade');

	app.get('/login', function(req, res){
		res.render('../app/pages/login');
	});
	
	app.get('/adminNav', function(req, res){
	console.log('adminNav');
      res.render('../app/templates/admins/sidebar');
    });
	
	app.get('/employeeNav', function(req, res){      
      res.render('../app/templates/employees/sidebar');
    });
	
	app.get('/managerNav', function(req, res){
      res.render('../app/templates/managers/sidebar');
    });
	
	app.get('/hrNav', function(req, res){
      res.render('../app/templates/hr/sidebar');
    });
    
  }
};
