document.addEventListener('click', function (event) {
  // Check if the clicked element is within a like button
  const likeElement = event.target.closest('.like-button');

  if (!likeElement) return; // Exit if it's not a like button

  // Ensure POSTID is defined
  if (!POSTID) {
    console.error('POSTID is undefined');
    return;
  }

  // Determine current like state
  const isLiked = likeElement.querySelector('i').classList.contains('liked');

  // Prepare the request payload
  const payload = `liked=${isLiked ? 'false' : 'true'}`;

  // Send AJAX request to toggle like state
  fetch(`/like/${POSTID}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': window.csrfToken,
    },
    body: payload,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to update like state');
      }
      return response.json();
    })
    .then((data) => {
      if (!data || typeof data.liked === 'undefined' || typeof data.like_count === 'undefined') {
        throw new Error('Invalid response from the server');
      }

      // Update like button appearance
      const likeIcon = likeElement.querySelector('i');
      const likeText = likeElement.querySelector('.like-button-text');
      if (data.liked) {
        likeIcon.classList.add('liked');
        likeText.textContent = 'Liked';
      } else {
        likeIcon.classList.remove('liked');
        likeText.textContent = 'Like';
      }

      // Update the like count
      const likeCountElement = document.querySelector(`.no-of-likes[data-post-id="${POSTID}"]`);
      console.log('likecountelement: ',likeCountElement);
      if (likeCountElement) {
        likeCountElement.innerHTML = `${data.like_count} <i class="fa-solid fa-heart"></i>`;
      }

      const likeCount = document.querySelector('.like-count');
      likeCount.innerHTML = `${data.like_count} <i class="fa-solid fa-heart"></i>`;
    })
    .catch((error) => {
      console.error('Error toggling like state:', error);
    });
});
