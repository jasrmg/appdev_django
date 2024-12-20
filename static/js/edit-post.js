$(document).ready(function () {
  // Reference to the edit post modal
  const $editPostModal = $("#editPost");

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

    console.log('postCategory: ', postCategory);
    // Set the form action dynamically based on editPostId
    const editPostActionUrl = editPostUrl.replace("0", editPostId);
    console.log(editPostActionUrl);
    $editPostForm.attr("action", editPostActionUrl);

    // Prefill the form fields
    const $titleInput = $("#editPostTitle");
    const $descriptionInput = $("#editPostDescription");
    const $ingredientsInput = $("#editPostIngredients");
    const $categorySelect = $("#editPostCategory");

    // Ensure the elements are not null before proceeding
    if ($titleInput.length > 0) {
      $titleInput.val(postTitle);
    }
    if ($descriptionInput.length > 0) {
      $descriptionInput.val(postDescription);
    }
    if ($ingredientsInput.length > 0) {
      $ingredientsInput.val(postIngredients);
    }
    if ($categorySelect.length > 0) {
      $categorySelect.val(postCategory);
    }
    console.log('val: ', $categorySelect.val(postCategory));
    // Show the edit modal
    $editPostModal.show();

    // Save the initial form values to detect changes
    const initialFormValues = {
      title: $titleInput.length > 0 ? $titleInput.val().trim() : '',
      category: $categorySelect.length > 0 ? $categorySelect.val().trim() : '',
      description: $descriptionInput.length > 0 ? $descriptionInput.val().trim() : '',
      ingredients: $ingredientsInput.length > 0 ? $ingredientsInput.val().trim() : '',
    };

    // Function to enable/disable submit button based on form changes
    const checkForChanges = () => {
      const currentFormValues = {
        title: $titleInput.length > 0 ? $titleInput.val().trim() : '',
        category: $categorySelect.length > 0 ? $categorySelect.val().trim() : '',
        description: $descriptionInput.length > 0 ? $descriptionInput.val().trim() : '',
        ingredients: $ingredientsInput.length > 0 ? $ingredientsInput.val().trim() : '',
      };

      // Check if any value has changed
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

    // Disable the submit button initially if no changes are made
    $submitEditPostBtn.prop("disabled", true);

    // Event listener for closing the modal
    const $closeEditPostBtn = $("#editPostX");
    $closeEditPostBtn.on("click", () => {
      toggleModal($editPostModal, false);
    });
  }

  // Attach event listener for the edit post button using event delegation
  $(document).on("click", "#openEditPostModalBtn", function () {
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
      type: "POST",  // Or "PUT" depending on your backend setup
      url: formActionUrl,
      data: formData,
      success: function (response) {
        // On success, do something (e.g., redirect or show a message)
        window.location.href = nextUrl;  // Redirect to the next URL after the post is edited
      },
      error: function (xhr, status, error) {
        // Handle errors here (e.g., show an error message)
        console.log("Error:", error);
      },
      complete: function () {
        // Re-enable the submit button after the request is complete
        $submitEditPostBtn.prop("disabled", false);
      }
    });
  });

  // Close modal if clicked outside of it
  $(window).on("click", function (event) {
    if ($(event.target).is($editPostModal))
      toggleModal($editPostModal, false);
  });

});
