$(document).ready(function () {
  $("#commentForm").on("submit", function (event) {
    event.preventDefault();
    //gather form data:
    const message = $("#addComment").val();
    const postId = $('input[name="post_id"]').val();

    const commentcsrfToken = $("input[name='csrfmiddlewaretoken']").val();
    $.ajax({
      type: "POST",
      url: window.addCommentUrl,
      data: {
        post_id: postId,
        message: message,
        csrfmiddlewaretoken: commentcsrfToken,
      },
      success: function (response) {
        //clear the comment box
        $("#addComment").val("");

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
        console.log("id added: ", response.comment_id);

        //append the new comment:
        $(".comments_section").append(newComment);
      },
      error: function (xhr, status, error) {
        console.error("Error: ", error);
      },
    });
  });
});
//------------------DELETE------------------------\\
document
  .querySelector(".comments_section")
  .addEventListener("click", function (event) {
    // Check if the clicked element is a delete button
    if (event.target.classList.contains("close-button")) {
      const commentId = event.target.dataset.commentId; // Get the comment ID
      openDeleteModal(commentId); // Open the modal with that comment ID
    }
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
// let commentIdToDelete;
// $(document).on("click", ".close-button", function () {
//   commentIdToDelete = $(this).data("comment-id");
//   console.log("ID to delete: ", commentIdToDelete);
//   $(`#commentDeleteConfirmationModal-${commentIdToDelete}`).show();
// });
//close the modal when the close or cancel button is clicked
// $(document).on("click", ".close, #cancelDeleteBtn", function () {
//   $(`#commentDeleteConfirmationModal-${commentIdToDelete}`).hide();
// });
// $("#closeDeleteModal, #cancelDeleteBtn").on("click", function () {
//   $(".modal").hide();
// });
//confirm delete
// $(document).on("click", "[id^='confirmDeleteBtn-']", function () {
//   const deleteCommentUrl = `/delete_comment/${commentIdToDelete}/`;
//   console.log("url: ", deleteCommentUrl);
//   $.ajax({
//     type: "POST",
//     url: deleteCommentUrl,
//     data: {
//       csrfmiddlewaretoken: $('input[name="csrfmiddlwaretoken"]').val(),
//     },
//     success: function (response) {
//       console.log(response);
//       if (response.status === "success") {
//         const contentremoved = $(
//           `button[data-comment-id="${commentIdToDelete}"]`
//         ).closest(".comment");
//         console.log("removed: ", contentremoved);
//         $(`button[data-comment-id="${commentIdToDelete}]`).closest(".comment");
//         console.log("outer html: ", contentremoved.prop("outerHTML"));
//         if (contentremoved.length) {
//           contentremoved.remove();
//           console.log("comment removed");
//         } else {
//           console.log("Comment not found in DOM");
//         }

//         $(`#commentDeleteConfirmationModal-${commentIdToDelete}`).hide();
//       } else {
//         alert("Failed to delete comment");
//       }
//     },
//     error: function (xhr, status, error) {
//       console.error("Error: ", error);
//       alert("there was an error");
//     },
//   });
// });

// $(`#confirmDeleteBtn-${commentIdToDelete}`).on("click", function () {
//   const deleteCommentUrl = `/delete_comment/${commentIdToDelete}/`;
//   console.log("url: ", deleteCommentUrl);
//   $.ajax({
//     type: "POST",
//     url: deleteCommentUrl,
//     data: {
//       csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
//     },
//     success: function (response) {
//       console.log(response);
//       if (response.status === "success") {
//         $(`button[data-comment-id="${commentIdToDelete}"]`)
//           .closest(".comment")
//           .remove();
//         $("#commentDeleteConfirmationModal").hide();
//       } else {
//         alert("Failed to delete comment");
//       }
//     },
//     error: function (xhr, status, error) {
//       console.error("Error: ", error);
//       alert("There was an error");
//     },
//   });
// });
