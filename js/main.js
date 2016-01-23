jQuery.noConflict()(function($){
  var $document = $(this);

  $document
    // TODO: Refactor to separate file?
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
    // END init slideout.js

    // TODO: Refactor to separate file?
    .on('click', 'a[rel*="track"]', function(){
      if (!window.ga) return; // Analytics disabled on `localhost`...

      ga('save', 'event', $.extend({
        eventCategory: 'link',
        eventAction: 'click'
      }, $(this).data));
    }) // click(a[rel*="track"])
  ; // END $document

  if ( document.location.hash === '#menu' ){
    $document.trigger('toggle.slideout');
  }
});
