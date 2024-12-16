$(document).ready(function () {
  //DELETE POST
  let postIdToDelete;
  const $deletePostModal = $("#deleteConfirmationModal");
  const $closePostModalDelBtn = $("#closeDeletePostModal");
  const $confirmPostDeleteBtn = $("#postConfirmDeleteBtn");
  const $cancelPostDeleteBtn = $("#cancelDeleteBtn");
  // const $openDeleteModal = $(".delete_icon");
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
    const nextUrl = $("#deletePostModalBtn").data("next");
    const searchQuery = new URLSearchParams(window.location.search).get('q');
    console.log('NEXT URL: ', nextUrl);

    postIdToDelete = postIdDel;
    $deletePostModal.show();

    //confirm and submit the deletion:
    $confirmPostDeleteBtn.on("click", () => {
    //create form to submit the delete post:
    const $deletePostForm = $("<form>", {
      method: "POST",
      action: deletePostUrl.replace("0", postIdToDelete),
    }).append(
      $("<input>", {
        type: "hidden",
        name: "csrfmiddlewaretoken",
        value: window.csrfToken,
      }),
      $("<input>", {
        type: 'hidden',
        name: 'next',
        value: nextUrl,
      })
    );

    //if its from the search include the q:
    if (searchQuery) {
        $deletePostForm.append(
            $("<input>", {
                type: "hidden",
                name: "q",
                value: searchQuery,
            })
        );
    }
    $("body").append($deletePostForm);
    $deletePostForm.submit();
  });
}
  // Event delegation for dynamically created delete buttons:
  $(document).on("click", "#deletePostModalBtn", function () {
    postIdToDelete = $(this).data("post-id"); // Get the post ID from the button's data attribute
    confirmDelete(postIdToDelete); // Open the delete confirmation modal
  });

  

  $(window).on("click", function (event) {
    if ($(event.target).is($deletePostModal))
        toggleModal($deletePostModal, false);
  })
})