function toggleDropdown(event) {
  event.stopPropagation();
  document.getElementById("userDropdown").classList.toggle("show");
}