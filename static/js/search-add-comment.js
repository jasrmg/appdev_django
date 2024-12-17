document.addEventListener('DOMContentLoaded', function() {
  const commentAddBtn = document.querySelector('.comment-add-btn');
  const commentInput = document.querySelector('.add-comment');
  const postId = document.querySelector('.post-image-link').getAttribute('data-post-id'); // Assuming the post ID is in your images
  console.log('POST ID: ', postId);

  commentAddBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent the default form submit behavior

    const message = commentInput.value.trim(); // Get the message from textarea

    if (message) {
      // Create a FormData object and append the post_id and message to it
      const formData = new FormData();
      formData.append('post_id', postId); // Send the post ID
      formData.append('message', message); // Send the comment message

      // Send the request with FormData
      fetch('/add_comment/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': window.csrfToken, // Add CSRF token for security
        },
        body: formData, // Use FormData as the request body
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // You can append the new comment to the comments section here
          const commentSection = document.querySelector('.popup-comments-section'); 
          const newCommentHTML = `
            <div class="single-comment" data-comment-id="${data.comment_id}">
              <img src="${data.user_avatar}" class="comment-avatar">
              <div class="comment-content">
                <div class="comment-header">
                  <div class="commentor-details">
                    <span class="comment-author">${data.user_name}</span>
                    <span class="comment-time">${data.created_at}</span>
                  </div>
                  <div class="comment-controls">
                    <span class="comment-control-btn edit-btn" data-comment-id="${data.comment_id}" title="Edit Comment">
                      <i class="fas fa-edit"></i>
                    </span>
                    <span class="comment-control-btn delete-btn" data-comment-id="${data.comment_id}" title="Delete Comment">&times;</span>
                  </div>
                </div>
                <p class="comment-message">${data.message}</p>
              </div>
            </div>
          `;
          commentSection.insertAdjacentHTML('beforeend', newCommentHTML);
          // commentSection.innerHTML = newCommentHTML + commentSection.innerHTML; // Add new comment to the top
          
          commentInput.value = ''; // Clear the textarea
          //update the comment count:
          updateCommentCount(data.comment_count);
        } else {
          console.error('Error adding comment');
        }
      })
      .catch(error => console.error('Error:', error));
    }
  });
});
