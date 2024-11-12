$(document).ready(function () {
  // Close the dropdown if you click somewhere else:
  $(document).on("click", function (event) {
    var $userDropdown = $("#userDropdown");
    var $foodDropdown = $("#foodDropdown");

    // Close user dropdown if it's visible and click is outside of it
    if (
      $userDropdown.hasClass("show") &&
      !$userDropdown.is(event.target) &&
      $userDropdown.has(event.target).length === 0
    ) {
      $userDropdown.removeClass("show");
    }

    // Close food dropdown if it's visible and click is outside of it
    if (
      $foodDropdown.hasClass("show") &&
      !$foodDropdown.is(event.target) &&
      $foodDropdown.has(event.target).length === 0
    ) {
      $foodDropdown.removeClass("show");
    }
  });

  // Define the dropdown toggle on the user button click
  $("#userDropdownButton").on("click", function (event) {
    event.stopPropagation();
    // Hide the food dropdown if it's open
    $("#foodDropdown").removeClass("show");
    $("#userDropdown").toggleClass("show");
  });

  // Define the dropdown toggle on the food button click
  $("#foodDropdownButton").on("click", function (event) {
    event.stopPropagation();
    // Hide the user dropdown if it's open
    $("#userDropdown").removeClass("show");
    $("#foodDropdown").toggleClass("show");
  });
});
