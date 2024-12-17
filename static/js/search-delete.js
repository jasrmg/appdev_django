document.addEventListener('DOMContentLoaded', function() {
  const deleteModal = document.getElementById('commentDeleteConfirmationModal');
  const closeModalBtn = document.getElementById('closeDeleteModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const successModal = document.getElementById('myModal'); // Modal for success/error message

  let currentCommentId = null;

  // Use event delegation to handle dynamically loaded delete buttons
  document.body.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-btn')) {
      currentCommentId = event.target.getAttribute('data-comment-id');
      console.log('ID: ', currentCommentId);
      deleteModal.style.display = 'block';
    }
  });

  // Close modal when the close button is clicked
  closeModalBtn.addEventListener('click', function() {
    deleteModal.style.display = 'none';
  });

  // Close modal when the cancel button is clicked
  cancelDeleteBtn.addEventListener('click', function() {
    deleteModal.style.display = 'none';
  });

  // Confirm deletion
  confirmDeleteBtn.addEventListener('click', function() {
    if (currentCommentId) {
      fetch(`/delete_comment/${currentCommentId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': window.csrfToken,
        },
        credentials: 'same-origin',
      })
      .then(response => {
        if (response.ok) {
          // Find and remove the comment from the DOM
          const commentElement = document.querySelector(`.single-comment[data-comment-id="${currentCommentId}"]`);
          console.log('comment element: ', commentElement)
          if (commentElement) {
            commentElement.remove();
          }

          // Close the delete confirmation modal
          deleteModal.style.display = 'none';

          // Show success modal
          successModal.style.display = 'block';  // Show the success/error modal
          $('#myModal').modal('show'); // Bootstrap modal (if you're using Bootstrap)

          // Close the success modal after a few seconds
          setTimeout(function() {
            $('#myModal').modal('hide');
            successModal.style.display = 'none';
          }, 2000);
        } else {
          console.error('Failed to delete the comment');
        }
      })
      .catch(error => {
        console.error('Error: ', error);
      });
    }
  });
});
