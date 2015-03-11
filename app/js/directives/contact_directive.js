angular.module("app").directive("contact", function(){
    return {
        link: function(scope, element, attrs){
            element.on("click", function(){
                $("#addCnct").parent().append('<div class="form-group"><label class="col-sm-2 control-label">Contact Number<span class="asterisk">*</span></label><div class="col-sm-5"><input type="text" class="form-control"></div><div class="col-sm-2"><select class="btn"><option>Cell</option><option>Work</option><option>Home</option><option>Fax</option></select></div><div class="col-sm-1"><img src="http://img.informer.com/icons/png/16/3225/3225535.png" class="remCls"></div></div>');
            });
        }
    };
});