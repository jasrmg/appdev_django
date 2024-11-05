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
      console.log("new comment id: ", postId);
      const newComment = `
        <div class="comment" data-post-id="${postId}">
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
      //count sa comments:
      const commentPostId = "{{ post.post_id }}";
      console.log("Comment Post ID: ", commentPostId);

      const commentCountSpan = $(`#commentCount-${postId}`);
      console.log("POST ID: ", postId);
      const currentCount = parseInt(commentCountSpan.text(), 10);
      commentCountSpan.text(currentCount + 1);
    },

    error: function (xhr, status, error) {
      console.error("Error: ", error);
    },
  });
});

let commentIdToDelete;
let postIdToUpdate;
$(document).on("click", ".close-button", function (event) {
  const commentId = $(this).data("comment-id");
  const postId = $(this).closest(".comment").data("post-id");
  console.log(postId);
  openDeleteModal(commentId, postId);
});

// Open the delete confirmation modal
function openDeleteModal(commentId, postId) {
  commentIdToDelete = commentId;
  postIdToUpdate = postId;
  const modal = document.getElementById("commentDeleteConfirmationModal");
  modal.style.display = "block";
}

// Close the modal when clicking on the close button
$(document).on("click", ".close", function () {
  const modal = document.getElementById("commentDeleteConfirmationModal");
  modal.style.display = "none";
});

// Confirm deletion and make AJAX call
$("#confirmDeleteBtn").on("click", function () {
  const deleteCommentUrl = `/delete_comment/${commentIdToDelete}/`; // URL to delete the comment
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

        // Update the comment count dynamically
        const commentCountSpan = $(`#commentCount-${postIdToUpdate}`);
        console.log("id ", postIdToUpdate);
        const currentCount = parseInt(commentCountSpan.text(), 10);
        commentCountSpan.text(currentCount - 1);
        // Hide the modal after successful deletion
        const modal = document.getElementById("commentDeleteConfirmationModal");
        modal.style.display = "none";
      } else {
        alert("Failed to delete comment");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error: ", error);
      alert("There was an error");
    },
  });
});

//--------------------------LOAD MORE--------------------------\\
$(document).on("click", "#seeMore", function () {
  const postId = $(this).closest(".comments_section").data("post-id"); // Get post ID from the closest parent
  console.log("Post ID: ", postId); // Debugging: check postId

  const currentCount = $(".comment").length; // Get the current number of comments displayed
  console.log("Current Comment Count: ", currentCount); // Debugging: check the current count

  $.ajax({
    type: "GET",
    url: `/load_more_comments/${postId}/`, // Use the postId
    data: {
      offset: currentCount, // Send the current number of comments as offset
      limit: 2, // Load 2 more comments
    },
    success: function (response) {
      if (response.comments.length > 0) {
        response.comments.forEach((comment) => {
          const newComment = `
                      <div class="comment" data-post-id="${comment.post_id}">
                          <img src="${comment.user_avatar}" alt="pp" class="avatar_post" />
                          <div class="comment_content">
                              <div class="comment_info">
                                  <h4>${comment.user_name}</h4>
                                  <p>${comment.created_at} ago</p>
                              </div>
                              <div contenteditable="false" id="comment-text-${comment.comment_id}">
                                  ${comment.message}
                              </div>
                          </div>
                          <div class="comment-controls">
                              <i class="fa-solid fa-pencil-alt pen-icon" style="color: #33221a"></i>
                              <button class="close-button" data-comment-id="${comment.comment_id}">&times;</button>
                          </div>
                      </div>
                  `;
          $(".comments_section").append(newComment); // Append the new comment
        });
      } else {
        $("#seeMore").hide(); // Hide the load more button if no more comments
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading more comments: ", error);
      alert("There was an error loading more comments.");
    },
  });
});
