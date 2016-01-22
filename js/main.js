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
    .on('click', 'a[rel="slideout-toggle"]', function(event){
      $document.trigger('toggle.slideout');

      return false;
    })
  ; // END $document

  $document.on('click', 'a[rel*="track"]', function(){
    if (!window.ga) return;

    ga('save', 'event', $.extend({
      eventCategory: 'link',
      eventAction: 'click'
    }, $(this).data));
  }); // click(a[rel*="track"])

  if ( document.location.hash === '#menu' ){
    console.log('open');
    $document.trigger('toggle.slideout');
  }
});
