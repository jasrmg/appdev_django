let POSTID = null;
document.addEventListener('DOMContentLoaded', function () {
  // Select all post image links and add a click event listener to each
  const postLinks = document.querySelectorAll('.post-image-link');
  
  if (postLinks.length > 0) {
    postLinks.forEach(function(link) {
      link.addEventListener('click', showPopup);
    });
  }

  // Close the popup when the close button is clicked
  const closeButton = document.getElementById('closePopupBtn');
  if (closeButton) {
    closeButton.addEventListener('click', closePopup);
  }

  // Close it when clicking outside
  const popup = document.getElementById('postPopup');
  popup.addEventListener('click', function(event) {
    const popupContent = document.querySelector('.post-popup-content');
    if (popup.classList.contains('show') && popupContent && !popupContent.contains(event.target)) {
      closePopup();
    }
  });

  // Focus on comment box if comment button is clicked
  const commentButton = document.querySelector('.comment-button');
  const commentArea = document.querySelector('.comment-input-container textarea');
  
  if (commentButton && commentArea) {
    commentButton.addEventListener('click', function() {
      commentArea.focus();
    });
  }
});

// Close the popup function
function closePopup() {
  document.getElementById('postPopup').classList.remove('show');
}

// Show popup function
function showPopup(event) {
  // Prevent default action if necessary
  event.preventDefault();

  // Get the post ID from the clicked element
  // const postId = event.currentTarget.getAttribute('data-post-id');
  POSTID = event.target.closest('.post-image-link').getAttribute('data-post-id');
  const popupContainer = document.querySelector('.popup-container');
  popupContainer.dataset.postId = POSTID;
  console.log('NEW POST ID: ', POSTID)
  
  if (!POSTID) {
    console.error('Post ID is undefined.');
    return;
  }

  // Log postId to verify
  console.log('Post ID:', POSTID);

  // Construct the URL dynamically
  const url = `/search/post_view/${POSTID}/`;
  console.log('Fetching from:', url);

  // Fetch data from the backend
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse JSON response
    })
    .then((data) => {
      // Update the popup content with data
      document.querySelector('.popup-heading .poster-name').textContent = `${data.first_name} ${data.last_name}`;
      document.querySelector('.user-details h3').textContent = `${data.first_name} ${data.last_name}`;
      document.querySelector('.popup-title').textContent = data.title;
      document.querySelector('.popup-description').textContent = data.description;
      document.querySelector('.post-time').textContent = timeSince(data.created_at);
      document.querySelector('.poster-avatar').src = data.avatar_url;

      // Update ingredients list
      const ingredientsList = document.querySelector('.ingredients-list');
      ingredientsList.innerHTML = ''; // Clear existing items
      data.ingredients.forEach((ingredient) => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
      });

      // Update image
      document.querySelector('.popup-image').src = data.images[0];

      // Update stats
      document.querySelector('.like-count').innerHTML = `
        ${data.like_count}<i class="fas fa-heart"></i> 
      `;
      document.querySelector('.comment-count').innerHTML = `
      ${data.comment_count}<i class="fas fa-comment"></i> 
      `;

      //like and comment buttons
      document.querySelector('.like-button').setAttribute('data-post-id', POSTID);
      document.querySelector('.comment-button').setAttribute('data-post-id', POSTID)
      const likeButtonText = document.querySelector('.like-button .like-button-text');
      if (data.user_liked) {
        likeButtonText.textContent = 'Liked';
      } else {
        likeButtonText.textContent = 'Like';
      }
      

      // Update comments
      const commentsSection = document.querySelector('.popup-comments-section');
      commentsSection.innerHTML = ''; // Clear existing comments
      if (data.comments.length === 0) {
        const noCommentsMessage = document.createElement('div');
        noCommentsMessage.classList.add('no-comment');
        noCommentsMessage.classList.add('single-comment');
        // noCommentsMessage.setAttribute('data-comment-id', comment.comment_id);
        noCommentsMessage.innerHTML = `
        <div class="comment-content">
          <div class="comment-header">
            <div class="commentor-details">
            </div>
          </div>
          <p class="no-comment-message">No one left a comment on this post.</p>
        </div>
        `;
        commentsSection.appendChild(noCommentsMessage);
      } else {
        data.comments.forEach((comment) => {
          const commentDiv = document.createElement('div');
          commentDiv.classList.add('single-comment');
          commentDiv.setAttribute('data-comment-id', comment.comment_id);
          commentDiv.innerHTML = `
            <img src="${comment.avatar_url}" class="comment-avatar">
            <div class="comment-content">
              <div class="comment-header">
                <div class="commentor-details">
                  <span class="comment-author">${comment.first_name} ${comment.last_name}</span>
                  <span class="comment-time">${timeSince(comment.created_at)}.</span>
                </div>  
                <div class="comment-controls">
                  ${comment.commentor_username === data.logged_username ? `
                    <span class="comment-control-btn edit-btn" title="Edit Comment">
                      <i class="fas fa-edit edit-btn" 
                      id="editCommentBtn-${comment.comment_id}" data-comment-id="${comment.comment_id}"></i>
                    </span>
                    <span class="comment-control-btn delete-btn" data-comment-id="${comment.comment_id}" 
                    title="Delete Comment">
                      &times;
                    </span>
                  ` : ''}
                </div>
              </div>
              <div class="comment-message" id="comment-text-${comment.comment_id}" contenteditable="false">${comment.content}</div>
              </div>
          `;

          commentsSection.appendChild(commentDiv);
        });
      }

      // Show the popup
      document.getElementById('postPopup').classList.add('show');
    })
    .catch((error) => {
      console.error('Error fetching popup data:', error);
    });
}

function timeSince(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000); // time difference in seconds

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / 86400);
  const months = Math.floor(diffInSeconds / 2592000); // Approximate month (30 days)
  const years = Math.floor(diffInSeconds / 31536000); // Approximate year (365 days)

  if (years > 0) {
    return years + " year" + (years > 1 ? "s" : "") + " ago";
  } else if (months > 0) {
    return months + " month" + (months > 1 ? "s" : "") + " ago";
  } else if (days > 0) {
    return days + " day" + (days > 1 ? "s" : "") + " ago";
  } else if (hours > 0) {
    return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
  } else if (minutes > 0) {
    return minutes + " minute" + (minutes > 1 ? "s" : "") + " ago";
  } else {
    return "Just now";
  }
}

//comment count update:
function updateCommentCount(count) {
  const commentCountElement = document.querySelector('.comment-count');
  commentCountElement.innerHTML = `${count} <i class="fas fa-comment"></i>`;

  // Check if there are no comments left
  const commentsSection = document.querySelector('.popup-comments-section');
  if (count === 0 && commentsSection) {
    // Clear existing content
    commentsSection.innerHTML = '';

    // Add "no comments" message
    const noCommentsMessage = document.createElement('div');
    noCommentsMessage.classList.add('no-comment');
    noCommentsMessage.classList.add('single-comment');
    noCommentsMessage.innerHTML = `
      <div class="comment-content">
        <div class="comment-header">
          <div class="commentor-details">
          </div>
        </div>
        <p class="no-comment-message">No one left a comment on this post.</p>
      </div>
    `;
    commentsSection.appendChild(noCommentsMessage);
  } else if (commentsSection) {
    const noCommentElement =  commentsSection.querySelector('.no-comment');
    if (noCommentElement) {
      noCommentElement.remove();
    }
  }
}
window.updateCommentCount = updateCommentCount;


/*===============================CLAUDE==================================*/
