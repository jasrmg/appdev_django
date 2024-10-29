$(document).ready(function () {
  //close the dropdown if u click somewhere else:
  $(document).on("click", function (event) {
    var $dropdown = $("#userDropdown");
    if (
      $dropdown.hasClass("show") &&
      !$dropdown.is(event.target) &&
      $dropdown.has(event.target).length === 0
    ) {
      $dropdown.removeClass("show");
    }
  });

  //EDITPROFILE:
  const $editProfileForm = $("#editProfile form");
  const $submitProfileBtn = $("#editProfileSubmitbtn");
  let formChanged = false;
  //function to close the modals:
  function toggleModal(modal, show) {
    if (show) {
      $(modal).show();
    } else {
      $(modal).hide();
    }
  }
  //enable submit btn when there is a change in the form:
  $editProfileForm.on("change", function () {
    formChanged = true;
    $submitProfileBtn.prop("disabled", false);
  });
  //prevent submission if no change:
  $editProfileForm.on("submit", function (e) {
    if (!formChanged) {
      e.preventDefault();
    } else {
      $submitProfileBtn.prop("disabled", true);
    }
  });
  //edit profile modal behavior:
  const $editProfileModal = $("#editProfile");
  const $openProfileModalBtn = $("#editProfileBtn");
  const $closeProfileModalBtn = $("#editX");
  //open edit profile modal:
  $openProfileModalBtn.on("click", function () {
    $editProfileModal.show();
  });
  //close modal when clicking the x button or outside the modal:
  $closeProfileModalBtn.on("click", () => {
    toggleModal($editProfileModal, false);
  });

  //FOLLOWING:
  const $followingModal = $("#followingModal");
  const $openFollowingBtn = $("#followingModalBtn");
  const $followingXBtn = $("#followingXBtn");
  //open the following modal:
  $openFollowingBtn.on("click", () => {
    $followingModal.show();
  });
  //close the following modal:
  $followingXBtn.on("click", () => {
    toggleModal($followingModal, false);
  });
  //FOLLOWER:
  const $followerModal = $("#followerModal");
  const $openFollowerBtn = $("#followerModalBtn");
  const $followerXBtn = $("#followerXBtn");
  $openFollowerBtn.on("click", () => {
    $followerModal.show();
  });
  $followerXBtn.on("click", () => {
    toggleModal($followerModal, false);
  });

  //EDIT BIO:
  const $bioForm = $("#editBio form");
  const $bioSubmitBtn = $("#editBioSubmitbtn");
  let bioFormChanged = false;
  $bioForm.on("change", () => {
    bioFormChanged = true;
    $bioSubmitBtn.prop("disabled", false);
  });
  $bioForm.on("submit", (e) => {
    if (!bioFormChanged) {
      e.preventDefault();
    }
  });
  //bio modal for open/close:
  const $bioModal = $("#editBio");
  const $editBioBtn = $("#editBioBtn");
  const $bioCloseBtn = $("#bioClose");
  $editBioBtn.on("click", () => {
    $bioModal.show();
  });
  $bioCloseBtn.on("click", () => {
    toggleModal($bioModal, false);
  });

  //CREATE POST:
  const $createPostForm = $("#createPost form");
  const $submitPostBtn = $("#createPostSubmitbtn");
  let createPostFormChanged = false;
  if ($createPostForm.length) {
    $createPostForm.on("change", function () {
      createPostFormChanged = true;
      $submitPostBtn.prop("disabled", false);
    });
  }
  $createPostForm.on("submit", (e) => {
    if (!createPostFormChanged) {
      e.preventDefault();
    }
  });
  const $createPostModal = $("#createPost");
  const $openCreatePostBtn = $("#createPostDiv");
  const $closeCreatePostBtn = $("#createPostX");
  $openCreatePostBtn.on("click", () => {
    $createPostModal.show();
  });
  $closeCreatePostBtn.on("click", () => {
    toggleModal($createPostModal, false);
  });

  //POST
  //DELETE
  let postIdToDelete;
  const $deletePostModal = $("#deleteConfirmationModal");
  const $closePostModalDelBtn = $("#closeDeletePostModal");
  const $confirmPostDeleteBtn = $("#postConfirmDeleteBtn");
  const $cancelPostDeleteBtn = $("#cancelDeleteBtn");
  const $openDeleteModal = $("#deletePostModalBtn");
  //close delete modal:
  $closePostModalDelBtn.on("click", () => {
    toggleModal($deletePostModal, false);
  });
  $cancelPostDeleteBtn.on("click", () => {
    toggleModal($deletePostModal, false);
  });

  //function to confirm delete:
  function confirmDelete(postIdDel) {
    console.log("confirm delete: ", postIdDel);
    postIdToDelete = postIdDel;
    $deletePostModal.show();
  }
  $openDeleteModal.on("click", function () {
    postIdToDelete = $(this).data("post-id");
    confirmDelete(postIdToDelete);
  });

  //confirm and submit the deletion:
  $confirmPostDeleteBtn.on("click", () => {
    const delPostToken = $(
      '#csrf_form input[name="csrfmiddlewaretoken"]'
    ).val();
    console.log(postIdToDelete);
    //create form to submit the delete post:
    const $deletePostForm = $("<form>", {
      method: "POST",
      action: deletePostUrl.replace("0", postIdToDelete),
    }).append(
      $("<input>", {
        type: "hidden",
        name: "csrfmiddlewaretoken",
        value: delPostToken,
      })
    );
    $("body").append($deletePostForm);
    $deletePostForm.submit();
  });

  //EDIT POST
  const $editPostModal = $("#editPost");
  //function to prefill the edit post modal fields
  function openEditModal(
    editPostId,
    postTitle,
    postCategory,
    postDescription,
    postIngredients
  ) {
    const $editPostModal = $("#editPost");
    const $editPostForm = $("#editPostForm");
    const $submitEditPostBtn = $("#editPostSubmitbtn");
    //set the form action dynamically
    const editPostActionUrl = editPostUrl.replace("0", editPostId);
    console.log(editPostActionUrl);
    $editPostForm.attr("action", editPostActionUrl);
    const $titleInput = $("#editPostTitle");
    const $descriptionInput = $("#editPostDescription");
    const $ingredientsInput = $("#editPostIngredients");
    const $categorySelect = $("#editPostCategory");

    $titleInput.val(postTitle);
    $ingredientsInput.val(postIngredients);
    $descriptionInput.val(postDescription);
    $categorySelect.val(postCategory);

    $editPostModal.show();
    const initialFormValues = {
      title: $titleInput.val().trim(),
      category: $categorySelect.val().trim(),
      description: $descriptionInput.val().trim(),
      ingredients: $ingredientsInput.val().trim(),
    };

    //enable disable submit button based on changes in the form fields:
    const checkForChanges = () => {
      const currentFormValues = {
        title: $titleInput.val().trim(),
        category: $categorySelect.val().trim(),
        description: $descriptionInput.val().trim(),
        ingredients: $ingredientsInput.val().trim(),
      };
      // Compare current values with initial values
      const formChanged =
        initialFormValues.title !== currentFormValues.title ||
        initialFormValues.description !== currentFormValues.description ||
        initialFormValues.ingredients !== currentFormValues.ingredients ||
        initialFormValues.category !== currentFormValues.category;

      // Enable/disable the submit button based on whether the form has changed
      $submitEditPostBtn.prop("disabled", !formChanged);
    };
    // Attach event listeners to form fields to detect changes
    $titleInput.on("input", checkForChanges);
    $descriptionInput.on("input", checkForChanges);
    $ingredientsInput.on("input", checkForChanges);
    $categorySelect.on("change", checkForChanges);

    // Disable the submit button initially (if no changes are made)
    $submitEditPostBtn.prop("disabled", true);

    //event listener for closing the modal:
    const $closeEditPostBtn = $("#editPostX");
    $closeEditPostBtn.on("click", () => {
      toggleModal($editPostModal, false);
    });
  }
  //edit post button trigger:
  const $openEditPostModalBtn = $("#openEditPostModalBtn");
  $openEditPostModalBtn.on("click", function () {
    const edtpostId = $(this).data("post-id");
    const postTitle = $(this).attr("title");
    const postCategory = $(this).data("post-category");
    const postDescription = $(this).data("post-description");
    const postIngredients = $(this).data("post-ingredients");

    openEditModal(
      edtpostId,
      postTitle,
      postCategory,
      postDescription,
      postIngredients
    );
  });

  //LIKE:
  $(document).on("click", ".like_button", function (e) {
    e.preventDefault();
    const postId = $(this).data("post-id");
    const $button = $(this);
    const csrfToken = $('#csrf_form input[name="csrfmiddlewaretoken"]').val();
    $.ajax({
      url: `/like/${postId}/`,
      type: "POST",
      data: {
        csrfmiddlewaretoken: csrfToken,
      },
      success: function (data) {
        if (data.liked) {
          $button.html('<i class="fa-solid fa-heart"></i> Unlike');
        } else {
          $button.html('<i class="fa-solid fa-heart"></i> Like');
        }
        $("#like-count-" + postId)
          .contents()
          .first()
          .replaceWith(data.like_count);
      },
      error: function (xhr, status, error) {
        console.error("an error occured: ", error);
      },
    });
  });
  //comment na js naa sa post.html line 141

  //FOLLOW:
  $("#followBtn").on("click", function (e) {
    e.preventDefault();
    const $username = $(this).data("username");
    const $button = $(this);
    const csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
    $.ajax({
      type: "POST",
      url: followUrl,
      data: {
        csrfmiddlewaretoken: csrfToken,
      },
      success: function (response) {
        if (response.following) {
          $button.text("Unfollow");

          //add the followers avatar:
          const avatarHtml = `
        <a href="/profile/${response.new_follower.username}">
        <img
          src="${response.new_follower.avatar_url}"
          alt="${response.new_follower.username}"
          class="follow_avatar"
          />
          </a>`;
          const followerHtml = `<div class="follower_card" data-username="${response.new_follower.username}">
            
            <a href="{% url 'profile' user.follower.username %}">
            <img
              src="${response.new_follower.avatar_url}"
              alt="${response.new_follower.username}"
              class="follower_picture"
            />
          </a>
            <p class="follower_name">${response.new_follower.last_name}, ${response.new_follower.first_name}</p>           
          </div>`;
          $("#followersAvatarContainer").append(avatarHtml);
          $("#followers-container").append(followerHtml);
        } else {
          $button.text("Follow");
          const loggedUser = $button.data("logged-in-username");
          console.log(`Removing avatar for: `, loggedUser);

          //remove the unfollowed users avatar
          $(
            `#followersAvatarContainer a[href="/profile/${loggedUser}"]`
          ).remove();
          $(`.follower_card[data-username="${loggedUser}"]`).remove();
        }
        //update the follower count:
        $("#followerCount").text(response.follower_count);
        //update the follower count in the #followerModalBtn
        $("#followerModalBtn").text(
          `${response.follower_count} follower${
            response.follower_count > 1 ? "s" : ""
          }`
        );
        $("#followed-by").text(response.follower_count + " people");
      },
      error: function (xhr, status, error) {
        console.log("error: " + error);
      },
    });
  });

  //clicking outside the modals:
  $(window).on("click", function (event) {
    if ($(event.target).is($editProfileModal))
      toggleModal($editProfileModal, false);
    else if ($(event.target).is($followingModal))
      toggleModal($followingModal, false);
    else if ($(event.target).is($followerModal))
      toggleModal($followerModal, false);
    else if ($(event.target).is($bioModal)) toggleModal($bioModal, false);
    else if ($(event.target).is($createPostModal))
      toggleModal($createPostModal, false);
    else if ($(event.target).is($deletePostModal))
      toggleModal($deletePostModal, false);
    else if ($(event.target).is($editPostModal))
      toggleModal($editPostModal, false);
  });
});
//----------------OUTSIDE THE $(document).ready(function())--------------------------\\
//NAVBAR DROPDOWN SETTINGS:
function toggleDropdown(event) {
  event.stopPropagation();
  document.getElementById("userDropdown").classList.toggle("show");
}

/* sa like nako// Variables for delete post
let postIdToDelete = null; // Store the ID of the post to delete
const $deleteModal = $("#deleteConfirmationModal");
const $closeDeleteModalBtn = $("#closeDeleteModal");
const $confirmDeleteBtn = $("#postConfirmDeleteBtn");
const $cancelDeleteBtn = $("#cancelDeleteBtn");

// Variables for edit post
const $editPostModal = $("#editPost");
const $closeEditPostBtn = $("#editPostX");

// Function to confirm deletion of post
function confirmDelete(postId) {
  console.log("Confirm Delete: ", postId);
  postIdToDelete = postId; // Store the post ID
  $deleteModal.show(); // Show the delete confirmation modal
}

// Close delete modal when 'X' or cancel button is clicked
$closeDeleteModalBtn.on("click", function () {
  console.log("close delete modal pressed");
  $deleteModal.hide(); // Close the delete modal
});

$cancelDeleteBtn.on("click", function () {
  console.log("cancel delete modal pressed");
  $deleteModal.hide(); // Close the delete modal
});

// Confirm and submit delete request
$confirmDeleteBtn.on("click", function () {
  const delcsrfToken = $('#csrf_form input[name="csrfmiddlewaretoken"]').val();
  
  // Create a form to submit the delete request
  const $form = $('<form>', {
    method: "POST",
    action: deletePostUrl.replace("0", postIdToDelete)
  }).append($('<input>', {
    type: "hidden",
    name: "csrfmiddlewaretoken",
    value: delcsrfToken
  }));

  // Append the form to the body and submit
  $("body").append($form);
  $form.submit();
});

// Function to open the edit post modal
function openEditPostModal(postId) {
  // Set the form action to target the correct post ID
  const $form = $editPostModal.find("form");
  $form.attr("action", `/edit-post/${postId}/`); // URL to edit the post

  // Show the edit modal
  $editPostModal.show();
}

// Close edit modal when 'X' is clicked
if ($closeEditPostBtn.length) {
  $closeEditPostBtn.on("click", function () {
    $editPostModal.hide(); // Close the edit post modal
  });
}

// Close either modal when clicking outside of it
$(window).on("click", function (event) {
  if ($(event.target).is($deleteModal)) {
    $deleteModal.hide(); // Close the delete modal
  } else if ($(event.target).is($editPostModal)) {
    $editPostModal.hide(); // Close the edit modal
  }
});

// AJAX for the like button
$(document).ready(function () {
  // Use event delegation
  $(document).on("click", ".like_button", function (e) {
    e.preventDefault(); // Prevent the default button behavior

    const postId = $(this).data("post-id"); // Get the post ID
    const $button = $(this); // Reference to the button that was clicked
    const csrfToken = $('#csrf_form input[name="csrfmiddlewaretoken"]').val();

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
        $("#like-count-" + postId).contents().first().replaceWith(data.like_count); // Update the like count
      },
      error: function (xhr, status, error) {
        console.error("An error occurred:", error);
      },
    });
  });
});
*/
