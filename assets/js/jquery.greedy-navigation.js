$(function () {
  var $btn = $("nav.greedy-nav .greedy-nav__toggle");
  var $hlinks = $("nav.greedy-nav .hidden-links");

  // Window listeners
  $hlinks.on("click", function () {
    $hlinks.addClass("hidden");
    $btn.removeClass("close");
  });
});
