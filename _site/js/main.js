$(document).ready(function(){
  var i = 1;
  console.log(varurl);
  $('.getter').on('click',function(e){
    i++;
    e.preventDefault();
    var max_pages = $(this).data('total-pages');
    $.ajax({
      url: '' + varurl + '/page' + i + '/',
      type: 'GET',
      success: function(data){
        $(data).find('.posts ul li').appendTo('.posts ul');
        console.log('Loaded posts from page '+i+'');
        // _gaq.push(['_trackPageview', '/page' + i + '']);
        if( i == max_pages ) {
          console.log('Loading the final page (page '+i+')');
          $('.getter').hide();
          $('.back').show();
        }
      },
      error: function(data) {
        console.log('Loading post(s) failed!');
      }
    });
  });

  $('.back').on('click', function() {
    $('html, body').animate({ scrollTop: 0 }, 200);
    return false;
  });
});
