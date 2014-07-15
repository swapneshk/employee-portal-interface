

module.exports = {
  drawRoutes: function(app) {

    // var user_collection = [
    //   { _id: 1, first_name: "Jeff", last_name: "Dupont", email: "jeff.dupont@gmail.com", address: "1384 N Quail Ln", city: "Gilbert", state: "AZ", zip: "85233", phone: "(480) 463-4845", active: true },
    //   { _id: 2, first_name: "Melissa", last_name: "Dupont", email: "melissa.k.dupont@gmail.com", address: "1384 N Quail Ln", city: "Gilbert", state: "AZ", zip: "85233", phone: "(480) 463-4845", active: true },
    //   { _id: 3, first_name: "Mark", last_name: "Pogan", email: "mark.pogan@gmail.com", address: "1384 N Quail Ln", city: "Gilbert", state: "AZ", zip: "85233", phone: "(480) 463-4845", active: false },
    //   { _id: 4, first_name: "Kathy", last_name: "Pogan", email: "kathy.pogan@gmail.com", address: "1384 N Quail Ln", city: "Gilbert", state: "AZ", zip: "85233", phone: "(480) 463-4845", active: true }
    // ];

    // app.get("/api/users", function(req, res) {
    //   res.send(user_collection);
    // });
    // app.get("/api/users/:id", function(req, res) {
    //   var user = user_collection[req.params.id - 1];
    //   res.send(user);
    // });

    // app.all("/api/*", function(req, res) {
    //   res.send(404);
    // });

    // app.post("/login", function(req, res) {
    //   res.json({
    //     success: true,
    //     user: {
    //       _id: 1,
    //       first_name: "Jeff",
    //       last_name: "Dupont",
    //       email: "jeff.dupont@gmail.com",
    //       roles: ["admin"]
    //     }
    //   });
    // });
    // app.post("/logout", function(req, res) {
    //   res.json({
    //   });
    // });

    // // catch all
    // app.get("*", function( req, res ) {
    //   console.log("all pages get me");
    // });
  }
};
