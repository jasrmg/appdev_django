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
            //update the comment count in the search.html template:
            const commentCountElement = document.querySelector(`.no-of-comments[data-post-id="${POSTID}"]`)
            if (commentCountElement) {
              let currentCount = parseInt(commentCountElement.firstChild.textContent.trim(), 10);
              currentCount--;
              //update the text count:
              commentCountElement.innerHTML = `
                ${currentCount} <i class="fa-solid fa-comment"></i>
              `
            }
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
});
