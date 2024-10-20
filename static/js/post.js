//delete, edit and like js
// Variables for delete post
let postIdToDelete = null; // Store the ID of the post to delete
const deleteModal = document.getElementById("deleteConfirmationModal");
const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
const confirmDeleteBtn = document.getElementById("postConfirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

// Variables for edit post
const editPostModal = document.getElementById("editPost");
const closeEditPostBtn = document.getElementById("editPostX");

// Function to confirm deletion of post
function confirmDelete(postId) {
  console.log("Confirm Delete: ", postId);
  postIdToDelete = postId; // Store the post ID
  deleteModal.style.display = "block"; // Show the delete confirmation modal
}

// Close delete modal when 'X' or cancel button is clicked
closeDeleteModalBtn.onclick = function () {
  console.log("close delete modal pressed")
  deleteModal.style.display = "none"; // Close the delete modal
};

cancelDeleteBtn.onclick = function () {
  console.log("cancel delete modal pressed")
  deleteModal.style.display = "none"; // Close the delete modal
};

// Confirm and submit delete request
confirmDeleteBtn.onclick = function () {
  var delcsrfToken = $('#csrf_form input[name="csrfmiddlewaretoken"]').val();
  // Create a form to submit the delete request
  const form = document.createElement("form");
  form.method = "POST";
  form.action = deletePostUrl.replace("0", postIdToDelete); // Replace 0 with postIdToDelete

  // Create a CSRF token input
  const csrfInput = document.createElement("input");
  csrfInput.type = "hidden";
  csrfInput.name = "csrfmiddlewaretoken"; // Ensure CSRF token is sent
  csrfInput.value = delcsrfToken; // Get CSRF token from Django template context
  form.appendChild(csrfInput);

  // Append the form to the body and submit
  document.body.appendChild(form);
  form.submit();
};

// Function to open the edit post modal
function openEditPostModal(postId) {
  // Set the form action to target the correct post ID
  const form = editPostModal.querySelector("form");
  form.action = `/edit-post/${postId}/`; // Assuming the URL to edit the post

  // Show the edit modal
  editPostModal.style.display = "block";
}

// Close edit modal when 'X' is clicked
if (closeEditPostBtn) {
  closeEditPostBtn.onclick = function () {
    editPostModal.style.display = "none"; // Close the edit post modal
  };
}

// Close either modal when clicking outside of it
window.onclick = function (event) {
  if (event.target === deleteModal) {
    deleteModal.style.display = "none"; // Close the delete modal
  } else if (event.target === editPostModal) {
    editPostModal.style.display = "none"; // Close the edit modal
  }
};

//ajax for the like button fuck send help
$(document).ready(function () {
  // Use event delegation
  $(document).on("click", ".like_button", function (e) {
    e.preventDefault(); // Prevent the default button behavior

    var postId = $(this).data("post-id"); // Get the post ID
    var $button = $(this); // Reference to the button that was clicked
    var csrfToken = $('#csrf_form input[name="csrfmiddlewaretoken"]').val();

    $.ajax({
      url: `/like/${postId}/`, // URL for the toggle_like view
      type: "POST",
      data: {
        csrfmiddlewaretoken: csrfToken, // CSRF token
      },
      success: function (data) {
        // Update the button text based on the response
        if (data.liked) {
          $button.html('<i class="fa-solid fa-heart"></i> Unlike'); // Change to Unlike
        } else {
          $button.html('<i class="fa-solid fa-heart"></i> Like'); // Change to Like
        }
        // Update the like count display
        $("#like-count-" + postId)
          .contents()
          .first()
          .replaceWith(data.like_count); // Update the like count
      },
      error: function (xhr, status, error) {
        console.error("An error occurred:", error);
      },
    });
  });
});
