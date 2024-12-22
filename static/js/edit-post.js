$(document).ready(function () {
  // Reference to the edit post modal
  const $editPostModal = $("#editPost");

  // Function to toggle modal visibility
  const toggleModal = (modal, show) => {
    if (show) {
      modal.show();
    } else {
      modal.hide();
    }
  };

  // Function to prefill the edit post modal fields
  function openEditModal(
    editPostId,
    postTitle,
    postCategory,
    postDescription,
    postIngredients
  ) {
    const $editPostForm = $("#editPostForm");
    const $submitEditPostBtn = $("#editPostSubmitbtn");

    // Set the form action dynamically based on editPostId
    const editPostActionUrl = editPostUrl.replace("0", editPostId)
    console.log('url: ', editPostActionUrl);
    $editPostForm.attr("action", editPostActionUrl);

    // Prefill the form fields
    $("#editPostTitle").val(postTitle);
    $("#editPostDescription").val(postDescription);
    $("#editPostIngredients").val(postIngredients);
    $("#editPostCategory").val(postCategory); // Set the category ID (not text)

    // Show the edit modal
    toggleModal($editPostModal, true);

    // Save the initial form values to detect changes
    const initialFormValues = {
      title: postTitle.trim(),
      category: postCategory,
      description: postDescription.trim(),
      ingredients: postIngredients.trim(),
    };

    // Function to enable/disable submit button based on form changes
    const checkForChanges = () => {
      const currentFormValues = {
        title: $("#editPostTitle").val().trim(),
        category: $("#editPostCategory").val(),
        description: $("#editPostDescription").val().trim(),
        ingredients: $("#editPostIngredients").val().trim(),
      };

      const formChanged =
        initialFormValues.title !== currentFormValues.title ||
        initialFormValues.description !== currentFormValues.description ||
        initialFormValues.ingredients !== currentFormValues.ingredients ||
        initialFormValues.category !== currentFormValues.category;

      $submitEditPostBtn.prop("disabled", !formChanged);
    };

    // Attach event listeners to form fields to detect changes
    $("#editPostTitle, #editPostDescription, #editPostIngredients").on("input", checkForChanges);
    $("#editPostCategory").on("change", checkForChanges);

    // Disable the submit button initially
    $submitEditPostBtn.prop("disabled", true);

    // Close modal on "X" button click
    $("#editPostX").on("click", () => {
      toggleModal($editPostModal, false);
    });
  }

  // Attach event listener for the edit post button using event delegation
  $(document).on("click", "#openEditPostModalBtn", function () {
    const editPostId = $(this).data("post-id");
    const postTitle = $(this).data("post-title");
    const postCategory = $(this).data("post-category");
    const postDescription = $(this).data("post-description");
    const postIngredients = $(this).data("post-ingredients");

    openEditModal(
      editPostId,
      postTitle,
      postCategory,
      postDescription,
      postIngredients
    );
  });

  // Handle form submission via AJAX
  const $editPostForm = $("#editPostForm");
  const $submitEditPostBtn = $("#editPostSubmitbtn");

  $editPostForm.on("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const formActionUrl = $editPostForm.attr("action");
    const formData = $editPostForm.serialize(); // Serialize form data

    // Disable the submit button to prevent multiple submissions
    $submitEditPostBtn.prop("disabled", true);

    // Perform AJAX form submission
    $.ajax({
      type: "POST",
      url: formActionUrl,
      data: formData,
      success: function (response) {
        if (response.success) {
          // Update the post dynamically on the page
          const postId = $editPostForm.attr("action").split("/").filter(Boolean).pop();
          console.log('post id part edit: ', postId)

          // new values from the form
          const newTitle = $("#editPostTitle").val();
          const newDescription = $("#editPostDescription").val();
          const newIngredients = $("#editPostIngredients").val();
          const newCategory = $("#editPostCategory").val(); 

          // Update data-* attributes after successfully updating the post
          $(`#openEditPostModalBtn[data-post-id="${postId}"]`)
          .data("post-title", newTitle)
          .data("post-description", newDescription)
          .data("post-ingredients", newIngredients)
          .data("post-category", newCategory);


          // Update the DOM with the new data:
          const updatedPostContainer = $(`#post-${postId}`);
          updatedPostContainer.find(".home-post-title").text(newTitle);
          updatedPostContainer.find(".post-description").text(newDescription);
          updatedPostContainer.find(".post-ingredients").text(newIngredients);
          updatedPostContainer.find(".post-category").text(newCategory);

          // Home title change
          $(`#post-title-${postId}`).text(newTitle);

          // Close the modal
          toggleModal($editPostModal, false);

          //open the success pop up modal:
          // showModal(response.message, 'success')
        } else {
          // Display validation errors to the user
          // showModal('Post update failed', 'error')
        }
      },
      error: function (xhr, status, error) {
        console.error("AJAX Error:", error);
        alert("An error occurred while updating the post.");
      },
      complete: function () {
        // Re-enable the submit button after request completion
        $submitEditPostBtn.prop("disabled", false);
      },
    });
  });
  //for showing the success or error modal after edit? i global? idk
  
  $(document).ready(function () {
    $("#editPostForm").submit(function (e) {
      e.preventDefault(); // Prevent form from submitting normally
  
      const formActionUrl = $(this).attr("action");
      const formData = $(this).serialize();
  
      $.ajax({
        type: "POST",
        url: formActionUrl,
        data: formData,
        success: function (response) {
          if (response.success) {
            // Show success modal with response message
            showModal(response.message, 'success');
          } else {
            // Show error modal with default error message
            showModal('Post update failed', 'error');
          }
        },
        error: function () {
          showModal('An error occurred. Please try again.', 'error');
        }
      });
    });
  });
  
    
  // Close modal if clicked outside of it
  $(window).on("click", function (event) {
    if ($(event.target).is($editPostModal)) {
      toggleModal($editPostModal, false);
    }
  });
});
