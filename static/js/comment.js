//function para sa just now or sa time ig append:
window.timeAgo = (createdAt) => {
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
  return "Just now."; // Should not reach here
};
$(document).on("submit", ".comment_section", function (event) {
  event.preventDefault();

  // Store reference to `this` in a variable
  const form = this; // Stoe the form reference

  // Gather form data using class selectors
  const message = $(form).find(".addComment").val(); // Use class selector
  const postId = $(form).find('input[name="post_id"]').val();

  $.ajax({
    type: "POST",
    url: window.addCommentUrl,
    data: {
      post_id: postId,
      message: message,
      csrfmiddlewaretoken: window.csrfToken,
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
              <p>${timeAgo(response.created_at)}</p>
            </div>
            <div class="edit-comment" contenteditable="false" id="comment-text-${ response.comment_id }">
          <p>${response.message}</p>
        </div>
              
            </div>
            <div class="comment-controls">
              <i class="fas fa-edit edit-comment-btn"
              id="editCommentBtn-${ response.comment_id }" onclick="toggleEdit('${ response.comment_id }')"></i>
              <button class="close-button" data-comment-id=${
                response.comment_id
              }>&times;</button>
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

      let initialCommentLimit = 2;
      const seeMoreButton = $( `.seeMore[data-post-id="${postId}"]`);
      const currentCount = parseInt(commentCountSpan.text(), 10) + 1;
      commentCountSpan.text(currentCount);
      if (currentCount > initialCommentLimit) {
        seeMoreButton.show();
      } else {
        seeMoreButton.hide();
      }
      //ensures load more button stays at the bottom
      if (seeMoreButton.length) {
        seeMoreButton.detach();
        commentsSection.append(seeMoreButton)
      }
      // commentsSection.append(seeMoreButton); // Append it below the new comment
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
        // console.log("id ", postIdToUpdate);
        const currentCount = parseInt(commentCountSpan.text(), 10) - 1;
        commentCountSpan.text(currentCount);
        // Hide the modal after successful deletion
        const modal = document.getElementById("commentDeleteConfirmationModal");
        modal.style.display = "none";


        
        // let allComments = [];
        // $('.comment').each(function () {
        //   const commentId = $(this).find('.close-button').data('comment-id');
        //   if (commentId) {
        //     allComments.push(commentId)
        //   }
        // })
        // console.log('ALL COMMENTS? ', allComments);
        
        //if less than 2 ang comments d ta mo fetch
        if (currentCount >= 2) {
          //fetch 1 more comment to maintain 2 comments shown by default:
          $.ajax({
            type: "GET",
            url: `/fetch_next_comment/`,
            data: {
              post_id: postIdToUpdate,
              last_displayed_comment_id: commentIdToDelete,
            },
            success: function (response) {
              console.log('LOGGED USER USERNAME: ', response.logged_username);
              console.log('COMMENT: ', response.comment);
              console.log('STATUS: ', response.status);
              console.log('ERROR: ', response.message)
              
              if (response.status === "success" && response.comment) {
                const timeAgo = window.timeAgo(response.comment.created_at)
                // console.log('created at: ', timeAgo);
                const commentsSection = $(`.comments_section[data-post-id="${postIdToUpdate}"]`);
                const nextComment =  `
                  <div class="comment" data-post-id="${postIdToUpdate}">
                    <img src="${response.comment.user_avatar}" alt="${response.comment.username}" class="avatar_post"/>
                    <div class="comment_content">
                      <div class="comment_info">
                        <h4>${response.comment.first_name} ${response.comment.last_name}</h4>
                        <p>${timeAgo}</p>
                      </div>
                      <div class="edit-comment" contenteditable="false" id="comment-text-${response.comment.id}">
                          ${response.comment.message}
                      </div>
                    </div>
                    ${response.comment.username === response.logged_username ? `
                      <div class="comment-controls">
                        <i class="fas fa-edit edit-comment-btn" 
                        id="editCommentBtn-${response.comment.id}" 
                        onclick="toggleEdit('${response.comment.id}')"></i>
                        <button class="close-button" 
                        data-comment-id="${response.comment.id}" 
                        onclick="openDeleteModal('${response.comment.id}')">
                          &times;
                        </button>
                      </div>
                    ` : ''}
                  </div>
                `;
                const seeMoreButton = $(`.seeMore[data-post-id="${postIdToUpdate}"]`);
                if (seeMoreButton.length > 0) {
                  seeMoreButton.before(nextComment)
                } else {
                  commentsSection.append(nextComment);
                }
              }
          //check if 'load more' should be removed
          const initialCommentLimit = 2;
          // console.log('DELETE CURRENT COUNT: ', currentCount)
          if (currentCount <= initialCommentLimit) {
          console.log('TRUE');
          const seeMoreButton = $(`.seeMore[data-post-id="${postIdToUpdate}"]`);
          if (seeMoreButton.length) {
            seeMoreButton.remove();
          }
        }
          },
          error: function(xhr, status, error) {
            console.error('Error fetching next comment: ', error);
          },
        });
  
        } 
        
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

//EDIT COMMENT:
let originalCommentText = "";
function toggleEdit(commentId) {
  const $commentText = $(`#comment-text-${commentId}`);
  const $button = $(`#editCommentBtn-${commentId}`);
  // console.log(commentId);
  //check the current state:
  if ($commentText.attr("contenteditable") === "false") {
    originalCommentText = $commentText.text();
    $commentText.attr("contenteditable", "true").focus();

    //style ig edit comment:
    $commentText.css({
      padding: "10px",
      "border-radius": "50px",
    });

    $button.removeClass("fa-pencil-alt").addClass("fa-check");

    $(document).on("click", handleOutsideClick);
    function handleOutsideClick(event) {
      if (
        !$commentText.is(event.target) &&
        !$commentText.has(event.target).length &&
        !$button.is(event.target) &&
        !$button.has(event.target).length
      ) {
        //cancel edit if user clicks outside:
        $commentText
          .attr("contenteditable", "false")
          .text(originalCommentText);
        $commentText.css({
          padding: "0",
        });
        $button.removeClass("fa-check").addClass("fas fa-edit edit-comment-btn");
        $(document).off("click", handleOutsideClick);
      }
    }
  } else {
    $commentText.attr("contenteditable", "false");
    $button.removeClass("fa-check").addClass("fas fa-edit edit-comment-btn");
    $commentText.css({
      padding: "0",
    });
    saveComment(commentId);
    $(document).off("click", handleOutsideClick);
  }
}
function saveComment(commentId) {
  const $commentText = $(`#comment-text-${commentId}`);
  const updatedComment = $commentText.text();
  
  $.ajax({
    type: "POST",
    url: "/save_comment/",
    data: {
      comment_id: commentId,
      updated_comment: updatedComment,
      csrfmiddlewaretoken: window.csrfToken,
    },
    success: function (response) {
      $commentText.attr("contenteditable", "false");
    },
    error: function (xhr, status, error) {
      console.log("Error: ", error);
    },
  });
}

//--------------------------LOAD MORE--------------------------\\
const LIMIT = 2; // Number of comments to load each time

$(document).on("click", ".seeMore", function () {
  console.log("clicked");

  const $button = $(this); // The clicked "Load More" button
  const postId = $button.closest(".comments_section").data("post-id");
  let offset = parseInt($button.data("offset")) || LIMIT; // Current offset from the button data

  // Check if the button is in "See Less" mode
  if ($button.text().trim() === "See Less") {
    // Reset to initial state: hide all but the first two comments
    offset = LIMIT; // Reset offset to initial value

    // Fade out extra comments and remove them after animation
    $(`.comments_section[data-post-id="${postId}"] .comment`)
      .slice(LIMIT)
      .fadeOut(500, function () {
        $(this).remove(); // Remove the comments after fade-out completes
      });

    $button.text("Load more...").data("offset", LIMIT); // Change text back to "Load more..." and reset offset
    return;
  }

  // Proceed with loading more comments
  $.ajax({
    url: `/load_more_comments/${postId}/`,
    data: {
      offset: offset, // Use the current offset
      limit: LIMIT, // Number of comments to load
    },
    type: "GET",
    success: function (data) {
      const comments = data.comments;
      const $commentsContainer = $(`.comments_section[data-post-id="${postId}"]`);

      // Append each new comment with a fade-in effect
      comments.forEach(function (comment) {
        const loggedInUsername = $(`#commentsSection-${comment.post_id}`).data("loggedUserName");
        const isSameUser = comment.user_name === loggedInUsername;

        const newComment = $(`
          <div class="comment" data-post-id="${comment.post_id}">
              <img src="${comment.user_avatar}" alt="Avatar" class="avatar_post" />
              <div class="comment_content">
                  <div class="comment_info">
                      <h4>${comment.user_name}</h4>
                      <p>${comment.created_at}</p>
                  </div>
                  <div contenteditable="false" id="comment-text-${comment.comment_id}">
                      ${comment.message}
                  </div>
              </div>
              ${
                isSameUser
                  ? `
                <div class="comment-controls">
                    <i class="fas fa-edit edit-comment-btn" 
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

      // Update the offset on the button
      $button.data("offset", offset + comments.length); // Increment offset by the number of loaded comments

      // Check if there are more comments to load
      if (!data.has_more) {
        $button.text("See Less"); // Change to "See Less" if no more comments
        const seeMoreButton = $button.detach(); // Detach the button
        $commentsContainer.append(seeMoreButton); // Append it again to the bottom
      } else {
        // Move the "Load More" button to the bottom as usual
        const seeMoreButton = $button.detach();
        $commentsContainer.append(seeMoreButton); // Append to the bottom of the comment section
      }
    },
    error: function () {
      console.error("Error loading more comments");
    },
  });
});
