angular.module("app").factory("sidepanelactiveService",function($location){
    return {
        test: function(){
            /* start of activate sidebar tab */   
             var current_url = $location.path();
             var buttons = angular.element('ul.sidebar-nav li a');
             for(var i=0;i<buttons.length;i++){
                     var href =  buttons.get(i).href.split(":8000")[1];
                     if(href == current_url){
                         angular.element("ul.sidebar-nav li a[href!='"+current_url+"']").parent().removeClass("current");
                         angular.element("ul.sidebar-nav li a[href='"+current_url+"']").parent().addClass("current");
                     }
             }
             /* End of code for activate sidebar tab*/
        }
    };
});