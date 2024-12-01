//ADD COMMENT, EDIT COMMENT NAA SA POST.HTML
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

      //function para sa just now or sa time ig append:
      const timeAgo = (createdAt) => {
        const now = new Date();
        const createdTime = new Date(createdAt); // Make sure `createdAt` is a proper date string
        const delta = now - createdTime; // Get the difference in milliseconds

        if (delta < 60 * 1000) {
          return "Just now";
        }

        const seconds = Math.floor(delta / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) {
          return `${years} year${years > 1 ? "s" : ""} ago`;
        }
        if (months > 0) {
          return `${months} month${months > 1 ? "s" : ""} ago`;
        }
        if (days > 0) {
          return `${days} day${days > 1 ? "s" : ""} ago`;
        }
        if (hours > 0) {
          return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }
        if (minutes > 0) {
          return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        }
        return "Just now"; // Should not reach here
      };
      const newComment = `
        <div class="comment" data-post-id="${postId}">
          <img src="${response.user_avatar}" alt="pp" class="avatar_post"/>
          <div class="comment_content">
            <div class="comment_info">
              <h4>${response.user_name}</h4>
              <p>${timeAgo(response.created_at)}</p>
            </div>
            <div class="edit-comment" contenteditable="false" id="comment-text-${ response.comment_id }">
          <p>${response.message}</p>
        </div>
              
            </div>
            <div class="comment-controls">
              <i class="fa-solid fa-pencil-alt pen-icon" style="color: #33221a" id="editCommentBtn-${ response.comment_id }" onclick="toggleEdit('${ response.comment_id }')"></i>
              <button class="close-button" data-comment-id=${
                response.comment_id
              }>&times;</button>
            </div>
          </div>
        `;

      // Append the new comment to the correct post's comments section
      commentsSection.append(newComment);
      const seeMoreButton = $("#seeMore");
      commentsSection.append(seeMoreButton); // Append it below the new comment
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
//DELETE COMMENT
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
$(document).on("click", ".cancel-delete-button", function () {
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
let offset = 2; // Start with the initial comments loaded
const LIMIT = 2; // Number of comments to load each time

$("#seeMore").on("click", function () {
  const postId = $(this).closest(".comments_section").data("post-id");

  // Check if we are in "See Less" mode
  if ($(this).text().trim() === "See Less") {
    // Reset to initial state: hide all but the first two comments
    offset = LIMIT; // Reset offset to initial value

    // Fade out extra comments and remove them after animation
    $(`.comments_section[data-post-id="${postId}"] .comment`)
      .slice(LIMIT)
      .fadeOut(500, function () {
        $(this).remove(); // Remove the comments after fade-out completes
      });

    $(this).text("Load more...").data("offset", LIMIT); // Change text back to "Load more..." and reset data-offset
    return;
  }

  // Proceed with loading more comments
  $.ajax({
    url: `/load_more_comments/${postId}/`,
    data: {
      offset: offset, // Use the current offset
      limit: LIMIT, // Ensure 'limit' is lowercase
    },
    type: "GET",
    success: function (data) {
      const comments = data.comments;
      const $commentsContainer = $(
        `.comments_section[data-post-id="${postId}"]`
      );

      // Append each new comment with a fade-in effect
      comments.forEach(function (comment) {
        const loggedInUsername = $(`#commentsSection-${comment.post_id}`).data(
          "loggedUserName"
        );
        const isSameUser = comment.user_name === loggedInUsername;

        const newComment = $(`
          <div class="comment" data-post-id="${comment.post_id}">
              <img src="${
                comment.user_avatar
              }" alt="Avatar" class="avatar_post" />
              <div class="comment_content">
                  <div class="comment_info">
                      <h4>${comment.user_name}</h4>
                      <p>${comment.created_at}</p>
                  </div>
                  <div contenteditable="false" id="comment-text-${
                    comment.comment_id
                  }">
                      ${comment.message}
                  </div>
              </div>
              ${
                isSameUser
                  ? `
                <div class="comment-controls">
                    <i class="fa-solid fa-pencil-alt pen-icon" style="color: #33221a" 
                       id="editCommentBtn-${comment.comment_id}" 
                       onclick="toggleEdit('${comment.comment_id}')"></i>
                    <button class="close-button" 
                            data-comment-id="${comment.comment_id}" 
                            onclick="openDeleteModal('${comment.comment_id}')">
                        &times;
                    </button>
                </div>
              `
                  : ""
              }
          </div>
        `).hide(); // Hide initially for fade-in effect

        $commentsContainer.append(newComment);
        newComment.fadeIn(500); // Fade in the new comment
      });

      // Update the offset
      offset += comments.length; // Increment offset by the number of loaded comments

      // Check if there are more comments to load
      if (!data.has_more) {
        $("#seeMore").text("See Less"); // Change to "See Less" if no more comments
      } else {
        // Move the "Load More" button to the bottom
        const seeMoreButton = $("#seeMore").detach(); // Detach to move
        $commentsContainer.append(seeMoreButton); // Append it again
      }

      // Move "See Less" below all added comments
      if ($("#seeMore").text() === "See Less") {
        const seeLessButton = $("#seeMore").detach();
        $commentsContainer.append(seeLessButton);
      }
    },
    error: function () {
      console.error("Error loading more comments");
    },
  });
});
