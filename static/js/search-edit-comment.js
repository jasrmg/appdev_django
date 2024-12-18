document.addEventListener('click', function(event) {
  const editingComment = document.querySelector('.comment-message[contenteditable="true"]');
  
  // Check if clicking outside the editing comment
  if (editingComment && 
      !editingComment.contains(event.target) && 
      !event.target.closest('.comment-content')) {
    const commentId = editingComment.id.split('-').pop();
    
    // Revert to non-editable state
    editingComment.setAttribute('contenteditable', 'false');
    editingComment.contentEditable = false;
    
    // Restore original text (in case editing was cancelled)
    const originalText = editingComment.getAttribute('data-original-text');
    if (originalText) {
      editingComment.textContent = originalText;
    }
    
    // Restore original edit and delete icons
    const commentControlsContainer = editingComment.closest('.comment-content')
      .querySelector('.comment-controls');
    commentControlsContainer.innerHTML = `
      <span class="comment-control-btn edit-btn" title="Edit Comment">
        <i class="fas fa-edit edit-btn" id="editCommentBtn-${commentId}" data-comment-id="${commentId}"></i>
      </span>
      <span class="comment-control-btn delete-btn" data-comment-id="${commentId}" title="Delete Comment">&times;</span>
    `;
  }
});

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('edit-btn')) {
    const commentId = event.target.dataset.commentId;
    const commentTextElement = document.getElementById(`comment-text-${commentId}`);
    const commentControlsContainer = event.target.closest('.comment-controls');
    
    // Store original text before editing
    commentTextElement.setAttribute('data-original-text', commentTextElement.textContent);
    
    commentTextElement.setAttribute('contenteditable', 'true');

    commentTextElement.focus();
        
    // Replace comment controls with save button
    commentControlsContainer.innerHTML = `
      <div class="comment-controls edit-mode">
        <button type="button" class="comment-save-btn save-btn" data-comment-id="${commentId}">
          <i class="fas fa-paper-plane save-btn" data-comment-id="${commentId}"></i>
        </button>
      </div>
    `;
  }
  
  // Save button clicked
  else if (event.target.classList.contains('save-btn')) {
    const commentId = event.target.dataset.commentId;
    const commentTextElement = document.getElementById(`comment-text-${commentId}`);
    const updatedComment = commentTextElement.innerText.trim();
    
    // Prevent saving empty comments
    if (!updatedComment) {
      alert('Comment cannot be empty');
      return;
    }
    
    // Send AJAX request to save the comment
    fetch('/save_comment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': window.csrfToken,
      },
      body: `comment_id=${commentId}&updated_comment=${encodeURIComponent(updatedComment)}`
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        // Revert to non-editable state
        commentTextElement.setAttribute('contenteditable', 'false');
        commentTextElement.contentEditable = false;
        
        // Restore original edit and delete icons
        const commentControlsContainer = commentTextElement.closest('.comment-content')
          .querySelector('.comment-controls');
        commentControlsContainer.innerHTML = `
          <span class="comment-control-btn edit-btn" title="Edit Comment">
            <i class="fas fa-edit edit-btn" id="editCommentBtn-${commentId}" data-comment-id="${commentId}"></i>
          </span>
          <span class="comment-control-btn delete-btn" data-comment-id="${commentId}" title="Delete Comment">&times;</span>
        `;
      } else {
        alert('Failed to save comment: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while saving the comment');
    });
  }
});

// Optional CSS for editing state
// const style = document.createElement('style');
// style.textContent = `
//   .comment-message[contenteditable="true"] {
//     border: 1px solid #007bff;
//     background-color: #f8f9fa;
//     outline: none;
//     padding: 5px;
//   }
  
//   .comment-input-container.edit-mode {
//     display: flex;
//     align-items: center;
//     justify-content: flex-end;
//     margin-top: 5px;
//   }
  
//   .comment-save-btn {
//     background-color: #007bff;
//     color: white;
//     border: none;
//     border-radius: 50%;
//     width: 35px;
//     height: 35px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     transition: background-color 0.3s ease;
//   }
  
//   .comment-save-btn:hover {
//     background-color: #0056b3;
//   }
  
//   .comment-save-btn i {
//     font-size: 18px;
//   }
// `;
// document.head.appendChild(style);