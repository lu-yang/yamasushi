angular.module('customFilters',[])

.filter('numberExpress',function(){
  return function(d) {
    if(d>0){
      return '+ '+d;
    }else if(d<0) {
      return '- '+d*(-1);
    }
 };
});
