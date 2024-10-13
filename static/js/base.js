function toggleDropdown(event) {
  event.stopPropagation();
  document.getElementById("userDropdown").classList.toggle("show");
}
//close the dropdown if u click somewhere else:
document.addEventListener("click", function (event) {
  var dropdown = document.getElementById("userDropdown");

  //check if the dropdown is visible
  if (dropdown.classList.contains("show") && !dropdown.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});
//editprofile js
