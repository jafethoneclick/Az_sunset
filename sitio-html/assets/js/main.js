(function () {
  var toggle = document.getElementById("ironclad-mobile-nav-toggle");
  var nav = document.getElementById("ironclad-mobile-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = !nav.classList.contains("hidden");
    nav.classList.toggle("hidden");
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });
})();
