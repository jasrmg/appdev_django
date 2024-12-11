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
  
      console.log('postCategory: ', postCategory)
      // Set the form action dynamically based on editPostId
      const editPostActionUrl = editPostUrl.replace("0", editPostId);
      console.log(editPostActionUrl);
      $editPostForm.attr("action", editPostActionUrl);
  
      // Prefill the form fields
      const $titleInput = $("#editPostTitle");
      const $descriptionInput = $("#editPostDescription");
      const $ingredientsInput = $("#editPostIngredients");
      const $categorySelect = $("#editPostCategory");
        
      //ensure the elements are not null before proceeding
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
      console.log('val: ', $categorySelect.val(postCategory))
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
      
      // console.log('post id: ', edtpostId)
      // console.log('post title: ', postTitle)
      // console.log('post category: ', postCategory)
      // console.log('post description: ', postDescription)
      // console.log('post ingredients: ', postIngredients)
      openEditModal(
        edtpostId,
        postTitle,
        postCategory,
        postDescription,
        postIngredients
      );
    });

    $(window).on("click", function (event) {
      if ($(event.target).is($editPostModal))
        toggleModal($editPostModal, false);
    })

});
