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
    // TODO: Select only for unsupported browsers?
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
      $.track($.extend({
        eventCategory: 'link',
        eventAction:   'click'
      }, $(this).data));
    }) // click(a[rel*="track"])

    // We only care about the _first_ `open` event, really...
    .one('open.details', 'details, .details', function(){
      $.track({ eventCategory: 'details', eventAction: 'open' });
    })
  ; // END $document

  /**
   * @param {Object} data containing `eventCategory`, `eventAction`, `eventLabel`, `eventValue`
   * @todo Refactor to separate file?
   */
  $.track = function track (data){
    if (!window.ga) return; // Analytics disabled on `localhost`...

    ga('save', 'event', $.extend(options, {
      eventCategory: undefined,
      eventAction: undefined,
      eventLabel: undefined,
      eventValue: undefined,
    }));
  }

  if ( document.location.hash === '#menu' ){
    $document.trigger('toggle.slideout');
  }
});
