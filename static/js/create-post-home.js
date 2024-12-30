document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector("#create-post-home form");
  const submitBtn = document.getElementById('create-post-home-submit-btn');
  //function to check if all required fields are filled
  function checkFormCompletion() {
    let isComplete = true;

    //iterate over form inputs to check if they are filled
    form.querySelectorAll('input, textarea, select').forEach(function (input) {
      if (input.type !== 'file' && input.hasAttribute('required') && !input.value.trim()) {
        isComplete = false;
      }
    });

    //enable or disable the submit button
    submitBtn.disabled = !isComplete;
  }
  
  //listen to changes on form inputs
  form.querySelectorAll('input, textarea, select').forEach(function (input) {
    input.addEventListener('input', checkFormCompletion);
    input.addEventListener('change', checkFormCompletion);
  });
  //initial check in case some fields are already filled
  checkFormCompletion();


  //open create post modal on click sa whtas on your mind
  document.getElementById('create-post-home-btn').addEventListener('click', function () {
    document.getElementById('create-post-home').style.display = 'block';
  });

  // close the modal on x button click
  document.getElementById('createPostX').addEventListener('click', function () {
    document.getElementById('create-post-home').style.display = 'none';
  });

    // Close modal when clicking outside of it
    document.getElementById('create-post-home').addEventListener('click', function (e) {
      if (e.target === document.getElementById('create-post-home')) {
        document.getElementById('create-post-home').style.display = 'none';
      }
    });

  //submit the form via ajax
  form.addEventListener('submit', function (e) {
    e.preventDefault();


    const formData = new FormData(this);
    const xhr = new XMLHttpRequest();

    const formAction = form.getAttribute('action');
    console.log('ACTION!!: ', formAction)
    xhr.open('POST', formAction, true);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    console.log('csrf token: ', csrfToken)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        if (data.success) {
          createdAt = timeSince(data.created_at);
          console.log(createdAt)
          //create the post template
          var newPostHtml = `
          <div class="home-post" id="post-${data.new_post_id}">
            <div class="home-post-header">
              <div class="home-post-owner">
                <img src="${data.avatar}" alt="" loading="lazy">
                <div class="home-post-owner-details">
                  <span class="owner-name">
                    ${data.first_name} ${data.last_name}
                  </span>
                  <span class="post-date">
                    ${createdAt}
                  </span>
                </div>
              </div>
              <div class="home-post-actions">
                <button class="edit-icon edit-btn"
                  data-post-title="${data.title}"
                  id="openEditPostModalBtn"
                  data-post-id="${data.new_post_id}"
                  data-post-category="${data.category_id}"
                  data-post-description="${data.description}"
                  data-post-ingredients="${data.ingredients}">
                  <i class="fas fa-edit" title="Edit"></i>
                </button>
                <button class="delete-post-button" title="Delete"
                  id="deletePostModalBtn"
                  data-post-id="${data.new_post_id}"
                  data-next-"home/">
                  &times;
                  </button>
              </div>
            </div>

            <div class="home-post-body">
              <span id="post-title-${data.new_post_id}"
              class="home-post-title">${data.title}</span>
              <div class="home-post-image">
                <a href="javascript:void(0)"
                  class="post-image-link"
                  data-post-id="${data.new_post_id}"
                  onclick="showPopup(event)">
                    <img src="${data.image}" alt="${data.title}" loading="lazy">
                </a>
              </div>
            </div>

            <div class="home-post-footer">
              <span class="no-of-likes"
                data-post-id="${data.new_post_id}">
                ${data.likes_count}<i class="fa-solid fa-heart"></i>
              </span>
              <span class="no-of-comments" 
                data-post-id="${data.new_post_id}">
                ${data.comments_count}<i class="fa-solid fa-comment"></i>
              </span>
            </div>
          </div>
          `;
          //append on the post container
          document.querySelector('.post-container').insertAdjacentHTML('afterbegin', newPostHtml);

          //reset the form
          document.querySelector('#create-post-home form').reset();
          document.getElementById('create-post-home').style.display = 'none';
        } else {
          alert('Error: '+ data.message )
        }
      }
    };

    xhr.onerror = function () {
      alert('Error submitting the post.');
    };
    xhr.send(formData)
  });
});