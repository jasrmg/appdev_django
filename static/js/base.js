$(document).ready(function () {
  //GLOBAL function to close the modals:
  window.toggleModal = function (modal, show) {
    if (show) {
      $(modal).show();
    } else {
      $(modal).hide();
    }
  }

  //EDITPROFILE:
  const $editProfileForm = $("#editProfile form");
  const $submitProfileBtn = $("#editProfileSubmitbtn");
  let formChanged = false;
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



  // //EDITPROFILE:
  // const $editProfileForm = $("#editProfile form");
  // const $submitProfileBtn = $("#editProfileSubmitbtn");
  // let formChanged = false;
  // //enable submit btn when there is a change in the form:
  // $editProfileForm.on("change", function () {
  //   formChanged = true;
  //   $submitProfileBtn.prop("disabled", false);
  // });
  // //prevent submission if no change:
  // $editProfileForm.on("submit", function (e) {
  //   if (!formChanged) {
  //     e.preventDefault();
  //   } else {
  //     $submitProfileBtn.prop("disabled", true);
  //   }
  // });
  // //edit profile modal behavior:
  // const $editProfileModal = $("#editProfile");
  // const $openProfileModalBtn = $("#editProfileBtn");
  // const $closeProfileModalBtn = $("#editX");
  // //open edit profile modal:
  // $openProfileModalBtn.on("click", function () {
  //   $editProfileModal.show();
  // });
  // //close modal when clicking the x button or outside the modal:
  // $closeProfileModalBtn.on("click", () => {
  //   toggleModal($editProfileModal, false);
  // });

  
  

  // // Reference to the edit post modal
  // const $editPostModal = $("#editPost");

  // // Function to prefill the edit post modal fields
  // function openEditModal(
  //   editPostId,
  //   postTitle,
  //   postCategory,
  //   postDescription,
  //   postIngredients
  // ) {
  //   const $editPostForm = $("#editPostForm");
  //   const $submitEditPostBtn = $("#editPostSubmitbtn");

  //   // Set the form action dynamically based on editPostId
  //   const editPostActionUrl = editPostUrl.replace("0", editPostId);
  //   console.log(editPostActionUrl);
  //   $editPostForm.attr("action", editPostActionUrl);

  //   // Prefill the form fields
  //   const $titleInput = $("#editPostTitle");
  //   const $descriptionInput = $("#editPostDescription");
  //   const $ingredientsInput = $("#editPostIngredients");
  //   const $categorySelect = $("#editPostCategory");

  //   $titleInput.val(postTitle);
  //   $ingredientsInput.val(postIngredients);
  //   $descriptionInput.val(postDescription);
  //   $categorySelect.val(postCategory);

  //   // Show the edit modal
  //   $editPostModal.show();

  //   // Save the initial form values to detect changes
  //   const initialFormValues = {
  //     title: $titleInput.val().trim(),
  //     category: $categorySelect.val().trim(),
  //     description: $descriptionInput.val().trim(),
  //     ingredients: $ingredientsInput.val().trim(),
  //   };

  //   // Function to enable/disable submit button based on form changes
  //   const checkForChanges = () => {
  //     const currentFormValues = {
  //       title: $titleInput.val().trim(),
  //       category: $categorySelect.val().trim(),
  //       description: $descriptionInput.val().trim(),
  //       ingredients: $ingredientsInput.val().trim(),
  //     };

  //     // Check if any value has changed
  //     const formChanged =
  //       initialFormValues.title !== currentFormValues.title ||
  //       initialFormValues.description !== currentFormValues.description ||
  //       initialFormValues.ingredients !== currentFormValues.ingredients ||
  //       initialFormValues.category !== currentFormValues.category;

  //     // Enable/disable the submit button based on whether the form has changed
  //     $submitEditPostBtn.prop("disabled", !formChanged);
  //   };

  //   // Attach event listeners to form fields to detect changes
  //   $titleInput.on("input", checkForChanges);
  //   $descriptionInput.on("input", checkForChanges);
  //   $ingredientsInput.on("input", checkForChanges);
  //   $categorySelect.on("change", checkForChanges);

  //   // Disable the submit button initially if no changes are made
  //   $submitEditPostBtn.prop("disabled", true);

  //   // Event listener for closing the modal
  //   const $closeEditPostBtn = $("#editPostX");
  //   $closeEditPostBtn.on("click", () => {
  //     toggleModal($editPostModal, false);
  //   });
  // }

  // // Attach event listener for the edit post button using event delegation
  // $(document).on("click", "#openEditPostModalBtn", function () {
  //   const edtpostId = $(this).data("post-id");
  //   const postTitle = $(this).attr("title");
  //   const postCategory = $(this).data("post-category");
  //   const postDescription = $(this).data("post-description");
  //   const postIngredients = $(this).data("post-ingredients");

  //   openEditModal(
  //     edtpostId,
  //     postTitle,
  //     postCategory,
  //     postDescription,
  //     postIngredients
  //   );
  // });

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
          $button.html('<i class="fa-solid fa-heart"></i> Liked');
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
  //EDIT comment na js naa sa post.html line 141
  //CREATE COMMENT NAA SA COMMENT.JS
  //para show sa comment form:
  $(document).on("click", ".comment_button", function () {
    $(this)
      .closest(".post")
      .find(".commentForm")
      .slideToggle(500, function () {
        const $textarea = $(this).find("textarea");
        if ($textarea.is(":visible")) {
          $textarea.focus();
        }
      });
  });
  const $deleteCommentModal = $("#commentDeleteConfirmationModal");

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
        //FOLLOWING OR NAKA FOLLOW
        if (response.following) {
          $button.text("Unfollow");

          //sa name dapit ni nga mga avatar
          const avatarCount = $("#followersAvatarContainer a").length;
          const avatarHtml = `
          <a href="/profile/${response.new_follower.username}">
            <img
              src="${response.new_follower.avatar_url}"
              alt="${response.new_follower.username}"
              class="follow_avatar"
            />
          </a>`;
          // console.log("avatar count: ", avatarCount);
          if (avatarCount < 6) {
            //add the followers avatar:
            $("#followersAvatarContainer").append(avatarHtml);
          }
          //sa modal:
          const followerModalHtml = `
          <a href="/profile/${response.new_follower.username}" style="text-decoration: none; color: inherit;" id="modalFollower-${response.new_follower.username}">
            <div class="f_container">
              <img src="${response.new_follower.avatar_url}" alt="${response.new_follower.username}">
              ${response.new_follower.first_name} ${response.new_follower.last_name}
            </div>
          </a>`;
          //remove no follower text:
          $("#noFollowerMessage").hide();
          //add follower to the modal:
          $("#followerModalBody").append(followerModalHtml);
          //sa sidebar na avatar sa followers:
          const followerCardCount = $(
            "#followers-container .follower_card"
          ).length;
          // console.log("follower card:", followerCardCount);
          const followerCardHtml = `<div class="follower_card" data-username="${response.new_follower.username}" style="display:none;">
              <a href="{% url 'profile' user.follower.username %}">
                <img
                  src="${response.new_follower.avatar_url}"
                  alt="${response.new_follower.username}"
                  class="follower_picture"
                />
              </a>
              <p class="follower_name">${response.new_follower.last_name}, ${response.new_follower.first_name}</p>           
            </div>`;
          if (followerCardCount < 6) {
            $("#followers-container").append(followerCardHtml);
            // followerCardHtml.fadeIn(300);
            $("#followers-container .follower_card:last-child").fadeIn(500);
          }
          if ($("#followerModalBody a").length !== 0) {
            $("#zeroFollower").remove();
          }
        } else {
          //WLAA NAKA FOLLOW
          $button.text("Follow");
          const loggedUser = $button.data("logged-in-username");
          console.log(
            `Checking and Removing avatar and follower card for: `,
            loggedUser
          );
          //check if the logged users avatar is in the displayed avatar:
          const avatarSelector = `#followersAvatarContainer a[href^="/profile/${loggedUser}"]`;
          console.log("avatar selector: ", avatarSelector);
          if ($(avatarSelector).length > 0) {
            console.log("avatar is found");
            $(avatarSelector).remove();
          } else {
            console.log("avatar not found");
          }
          //check if its in the sidebar follower cards:
          const cardSelector = `.follower_card[data-username="${loggedUser}"]`;
          console.log("card selector: ", cardSelector);
          if ($(cardSelector).length > 0) {
            console.log("follower card found");
            $(cardSelector).remove();
          } else {
            console.log("card selector not found");
          }
          // Remove follower from the modal
          const modalSelector = `#followerModalBody a[href^="/profile/${loggedUser}"]`;
          if ($(modalSelector).length > 0) {
            $(modalSelector).remove();
          }
          const zeroFollowerHtml = $("<p>")
            .text("No Follower")
            .attr("id", "zeroFollower");
          if ($("#followerModalBody a").length === 0) {
            if (!$("#zeroFollower").length) {
              $("#followerModalBody").append(zeroFollowerHtml);
            }
          }

          if (response.replacement_follower) {
            //check for replacement:
            const replacementFollower = response.replacement_follower;
            //create html for the replacement follower
            const replacementFollowerCardHtml = `
            <div class="follower_card" data-username="${replacementFollower.username}" style="display:none;">
              <a href="/profile/${replacementFollower.username}">
                <img src="${replacementFollower.avatar_url}" alt="${replacementFollower.username}" class="follower_picture"/>
              </a>
              <p class="follower_name">${replacementFollower.last_name}, ${replacementFollower.first_name}</p>
            </div>`;
            const followerCardCount = $(
              "#followers-container .follower_card"
            ).length;
            if (followerCardCount < 6) {
              $("#followers-container").append(replacementFollowerCardHtml);
              // replacementFollowerCardHtml.fadeIn(500);
              $("#followers-container .follower_card:last-child").fadeIn(500);
            }
          }
        }

        //update follower count:
        const followerCount = response.follower_count;
        let followerText;
        if (followerCount === 0) {
          followerText = "No Follower";
        } else if (followerCount === 1) {
          $("#noFollowerMessage").remove();
          followerText = "1 Follower";
        } else {
          followerText = `${followerCount} followers`;
        }
        $(".number_of_follower").text(followerText);
        //update the follower count:
        $("#followerCount").text(response.follower_count);
        //update the follower count in the #followerModalBtn
        $("#followerModalBtn").text(
          `${response.follower_count} follower${response.follower_count > 1 ? "s" : ""
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
    if ($(event.target).is($followingModal))
      toggleModal($followingModal, false);
    else if ($(event.target).is($editProfileModal))
      toggleModal($editProfileModal, false);
    else if ($(event.target).is($followerModal))
      toggleModal($followerModal, false);
    else if ($(event.target).is($bioModal)) 
      toggleModal($bioModal, false);
    else if ($(event.target).is($createPostModal))
      toggleModal($createPostModal, false);
    else if ($(event.target).is($deleteCommentModal))
      toggleModal($deleteCommentModal, false);
  });
});
//----------------OUTSIDE THE $(document).ready(function())--------------------------\\

