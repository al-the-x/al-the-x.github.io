(function(){
  var menu = new Slideout({
    menu: document.getElementById('menu'),
    panel: document.getElementById('panel'),
    side: 'right',
  });

  setTimeout(function(){
    menu.open();
  }, 500);

  setTimeout(function(){
    menu.close();
  }, 3000);
})();
