document.addEventListener('DOMContentLoaded', function() {
  const deleteModal = document.getElementById('commentDeleteConfirmationModal');
  const closeModalBtn = document.getElementById('closeDeleteModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  let currentCommentId = null;

  // Event delegation for dynamically loaded delete buttons
  document.body.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-btn')) {
      currentCommentId = event.target.getAttribute('data-comment-id');
      deleteModal.style.display = 'block';
    }
  });

  // Close modal on close button or cancel button
  closeModalBtn.addEventListener('click', () => (deleteModal.style.display = 'none'));
  cancelDeleteBtn.addEventListener('click', () => (deleteModal.style.display = 'none'));

  // Confirm deletion
  confirmDeleteBtn.addEventListener('click', function() {
    if (currentCommentId) {
      fetch(`/delete_comment/${currentCommentId}/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': window.csrfToken, // Ensure CSRF token is included
        },
        credentials: 'same-origin',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete the comment');
          }
          return response.json();
        })
        .then(data => {
          if (data.status === 'success') {
            // Remove the comment from the DOM
            const commentElement = document.querySelector(`.single-comment[data-comment-id="${currentCommentId}"]`);
            if (commentElement) {
              commentElement.remove();
            }

            // Update the comment count in the DOM
            updateCommentCount(data.comment_count);

            // Close the modal
            deleteModal.style.display = 'none';
          } else {
            console.error('Failed to delete the comment:', data.response);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });

  // // Function to update the comment count in the DOM
  // function updateCommentCount(commentCount) {
  //   const commentCountElement = document.querySelector('.comment-count');
  //   if (commentCountElement) {
  //     commentCountElement.innerHTML = `<i class="fas fa-comment"></i> ${commentCount} Comments`;
  //   }
  // }
});
