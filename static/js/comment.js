$(document).on("submit", ".comment_section", function (event) {
  event.preventDefault();

  // Store reference to `this` in a variable
  const form = this; // Stoe the form reference

  // Gather form data using class selectors
  const message = $(form).find(".addComment").val(); // Use class selector
  const postId = $(form).find('input[name="post_id"]').val();
  const commentcsrfToken = $(form)
    .find("input[name='csrfmiddlewaretoken']")
    .val();

  $.ajax({
    type: "POST",
    url: window.addCommentUrl,
    data: {
      post_id: postId,
      message: message,
      csrfmiddlewaretoken: commentcsrfToken,
    },
    success: function (response) {
      // Clear the comment box
      $(form).find(".addComment").val(""); // Clear using class selector

      // Use the postId already gathered
      const commentsSection = $(`.comments_section[data-post-id="${postId}"]`);

      const newComment = `
        <div class="comment">
          <img src="${response.user_avatar}" alt="pp" class="avatar_post"/>
          <div class="comment_content">
            <div class="comment_info">
              <h4>${response.user_name}</h4>
              <p>${response.created_at} ago</p>
            </div>
              <p>${response.message}</p>
            </div>
            <div class="comment-controls">
              <i class="fa-solid fa-pencil-alt pen-icon" style="color: #33221a"></i>
              <button class="close-button" data-comment-id=${response.comment_id}>&times;</button>
            </div>
          </div>
        `;

      // Append the new comment to the correct post's comments section
      commentsSection.append(newComment);
    },

    error: function (xhr, status, error) {
      console.error("Error: ", error);
    },
  });
});

// Delegate event listener to comments_section for delete buttons
$(document).on("click", ".close-button", function (event) {
  const commentId = $(this).data("comment-id"); // Get the comment ID
  openDeleteModal(commentId); // Open the modal with that comment ID
});

// Open the delete confirmation modal
function openDeleteModal(commentId) {
  commentIdToDelete = commentId; // Store the comment ID to be deleted
  const modal = document.getElementById("commentDeleteConfirmationModal");
  modal.style.display = "block"; // Show the modal
}

// Close the modal when clicking on the close button
document.querySelectorAll(".close").forEach(function (closeButton) {
  closeButton.onclick = function () {
    const modal = document.getElementById("commentDeleteConfirmationModal");
    modal.style.display = "none"; // Hide the modal
  };
});

// Confirm deletion and make AJAX call
document.getElementById("confirmDeleteBtn").onclick = function () {
  const deleteCommentUrl = `/delete_comment/${commentIdToDelete}/`;
  console.log("URL to delete: ", deleteCommentUrl);

  $.ajax({
    type: "POST",
    url: deleteCommentUrl,
    data: {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
    },
    success: function (response) {
      if (response.status === "success") {
        // Remove the comment from the DOM
        const commentToRemove = $(
          `button[data-comment-id="${commentIdToDelete}"]`
        ).closest(".comment");
        commentToRemove.remove();
        const modal = document.getElementById("commentDeleteConfirmationModal");
        modal.style.display = "none"; // Hide the modal
      } else {
        alert("Failed to delete comment");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error: ", error);
      alert("There was an error");
    },
  });
};
