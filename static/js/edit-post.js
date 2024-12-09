$(document).ready(function () {
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
  
      // Set the form action dynamically based on editPostId
      const editPostActionUrl = editPostUrl.replace("0", editPostId);
      console.log(editPostActionUrl);
      $editPostForm.attr("action", editPostActionUrl);
  
      // Prefill the form fields
      const $titleInput = $("#editPostTitle");
      const $descriptionInput = $("#editPostDescription");
      const $ingredientsInput = $("#editPostIngredients");
      const $categorySelect = $("#editPostCategory");
  
      $titleInput.val(postTitle);
      $ingredientsInput.val(postIngredients);
      $descriptionInput.val(postDescription);
      $categorySelect.val(postCategory);
  
      // Show the edit modal
      $editPostModal.show();
  
      // Save the initial form values to detect changes
      const initialFormValues = {
        title: $titleInput.val().trim(),
        category: $categorySelect.val().trim(),
        description: $descriptionInput.val().trim(),
        ingredients: $ingredientsInput.val().trim(),
      };
  
      // Function to enable/disable submit button based on form changes
      const checkForChanges = () => {
        const currentFormValues = {
          title: $titleInput.val().trim(),
          category: $categorySelect.val().trim(),
          description: $descriptionInput.val().trim(),
          ingredients: $ingredientsInput.val().trim(),
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
  
});