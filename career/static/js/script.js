$(document).ready(function(){
    $('.btn-submit-reg').click(function(){
      var email = $('.email').val();
      var contact = $('.phn').val();
      var flag = true;
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;    
      if(!regex.test(email)){
          flag = false    
          alert("invalid email id");   
      }   
      if(contact.length != 10){
          flag = false
          alert("invalid contact");
      }
      if(!flag) 
      {
          return false;
      }
    })
  });