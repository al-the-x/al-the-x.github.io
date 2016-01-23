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
    .on('click', 'summary, .summary', function(){
      $(this).closest('details, .details').trigger('toggle.details');
    })
    .on('open.details', 'details, .details', function(){
      $(this).attr('open', true);
    })
    .on('close.details', 'details, .details', function(){
      $(this).attr('open', false);
    })
    .on('toggle.details', 'details, .details', function(){
      $(this).trigger( ( $(this).is('[open]') ?
        'close' : 'open'
      ) + '.details');
    })
    // END <details> <summary> polyfill

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
