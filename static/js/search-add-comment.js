document.addEventListener('DOMContentLoaded', function() {
  const commentAddBtn = document.querySelector('.comment-add-btn');
  const commentInput = document.querySelector('.add-comment');
  

  commentAddBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent the default form submit behavior
    const message = commentInput.value.trim(); // Get the message from textarea

    if (message) {
      // Create a FormData object and append the post_id and message to it
      const formData = new FormData();
      //GLOBAL POST ID KAY KAPOY LABAD
      formData.append('post_id', POSTID); 
      formData.append('message', message);

      
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
          console.log('POST ID: ', POSTID);
          const createdAt = window.timeSince(data.createdAt)
          // You can append the new comment to the comments section here
          const commentSection = document.querySelector('.popup-comments-section'); 
          const newCommentHTML = `
            <div class="single-comment" data-comment-id="${data.comment_id}">
              <img src="${data.user_avatar}" class="comment-avatar">
              <div class="comment-content">
                <div class="comment-header">
                  <div class="commentor-details">
                    <span class="comment-author">${data.user_name}</span>
                    <span class="comment-time">${createdAt}.</span>
                  </div>
                  <div class="comment-controls">
                    <span class="comment-control-btn edit-btn" title="Edit Comment">
                      <i class="fas fa-edit edit-btn" id="editCommentBtn-${data.comment_id}" data-comment-id="${data.comment_id}"></i>
                    </span>
                    <span class="comment-control-btn delete-btn" data-comment-id="${data.comment_id}" title="Delete Comment">&times;</span>
                  </div>
                </div>
                <div class="comment-message" id="comment-text-${data.comment_id}" contenteditable="false">${data.message}</div>
              </div>
            </div>
          `;
          commentSection.insertAdjacentHTML('beforeend', newCommentHTML);

          commentInput.value = ''; // Clear the textarea
          //update the comment count:
          updateCommentCount(data.comment_count);
          //update the comment count in the search.html template
          const commentCountElement = document.querySelector(`.no-of-comments[data-post-id="${POSTID}"]`);
          console.log('cce: ', commentCountElement)
          if (commentCountElement) {
            let currentCount = parseInt(commentCountElement.firstChild.textContent.trim(), 10);
            currentCount++;

            //update the text content
            commentCountElement.innerHTML = `
              ${currentCount} <i class="fa-solid fa-comment"></i> 
            `;
          }
        } else {
          console.error('Error adding comment');
        }
      })
      .catch(error => console.error('Error:', error));
    }
  });
});
