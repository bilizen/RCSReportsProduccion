
/***this entity we are going to use in clasification and advance reports**/
function reportProgressEntity(){
    this.StoreName="";
    this.AcumulateGoal="";
    this.AcumulateSale="";
    this.getStoreName = function(){
        return this.StoreName;
    }
    this.setStoreName = function(storeName){
        this.StoreName = storeName;
    }
    this.getAcumulateGoal = function(){
        return this.AcumulateGoal;    
    }
    this.setAcumulateGoal = function(acumulateGoal){
        this.AcumulateGoal = acumulateGoal;
    }
    this.getAcumulateSale = function(){
        return this.AcumulateSale;
    }
  this.setAcumulateSale = function(acumulateSale){
      this.AcumulateSale = acumulateSale;
  }
}




