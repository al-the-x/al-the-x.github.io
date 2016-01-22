jQuery.noConflict()(function($){
  var $document = $(this);

  $document
    .data('menu', new Slideout({
      menu: document.getElementById('menu'),
      panel: document.getElementById('panel'),
      side: 'right',
    }))
    .on('toggle.slideout', function(){
      $(this).data('menu').toggle();
    })
    .on('click', 'a[rel="slideout-toggle"]', function(){
      $document.trigger('toggle.slideout');
    })
  ; // END $document

  if ( document.location.hash === '#menu' ){
    console.log('open');
    $document.trigger('toggle.slideout');
  }
});
