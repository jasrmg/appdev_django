document.addEventListener("DOMContentLoaded", function () {
  let currentPath = window.location.pathname;
  let filterValue = currentPath.split('/')[2]
  let currentFilter = filterValue || 'all';
  let isLoading = false;
  let noMorePosts = false;
  if (performance.navigation.type == 1 || 0 ) {
    //1 = refresh
    //0 = url click
    //2 = redirection
    // If it's a reload (F5 or reload button), add `refresh=true` to the URL
    const url = new URL(window.location.href);
    console.log(!url.searchParams.has('refresh'))
    if (!url.searchParams.has('refresh')) {
      url.searchParams.set('refresh', 'true');
      window.location.href = url.toString();  // Redirect to the new URL with `refresh=true`
    }
  }
  

  // Function to load more posts with the selected filter
  const loadMorePosts = () => {
    console.log('Loading more posts....')
    if (isLoading || noMorePosts) return;

    isLoading = true;
    const loadMorePostURL = `more/${currentFilter}/?offset=${window.offset || 0}`;    
    console.log('current filter :', currentFilter);

    fetch(loadMorePostURL, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.no_more_posts) {
          const end = document.querySelector('.no-more-post');
          if (end) {
            isLoading = false;
            return;
          }

          // Create and append the "no more posts" div
          const noMorePostsDiv = document.createElement('div');
          noMorePostsDiv.className = 'home-post no-more-post';
          noMorePostsDiv.innerHTML = `
            <span class="no-more-post">No more posts to load.</span>
          `;
          document.querySelector('.post-container').appendChild(noMorePostsDiv);
          isLoading = false;
          return;
        }

        // Add new posts to the container
        data.posts_data.forEach(post => {
          const timeAgo = window.timeSince(post.created_at)
          console.log('TIME: ', timeAgo)
          console.log('?: ', post.same_user)
          const postHtml = `
            <div class="home-post" id="post-${post.post_id}">
              <div class="home-post-header">
                <div class="home-post-owner">
                  <img src="${ post.avatar }" alt="${post.poster_username}" loading="lazy"> 
                  <div class="home-post-owner-details">
                    <span class="owner-name">${post.first_name} ${post.last_name}</span>
                    <span class="post-date">${timeAgo}.</span>
                  </div>
                </div>
                ${post.same_user ? `
                <div class="home-post-actions">
                  <button class="edit-icon" 
                  id="openEditPostModalBtn"
                  data-post-title="${post.title}"
                  data-post-id="${post.post_id}"
                  data-post-category="${post.category_id}"
                  data-post-description="${post.description}"
                  data-post-ingredients="${post.ingredients}">
                    <i class="fas fa-edit" title="Edit"> </i>
                  </button>
                  <button class="delete-post-button" title="Delete"
                  id="deletePostModalBtn"
                  data-post-id="${post.post_id}"
                  data-next="home/">
                    &times;
                  </button>
                </div>
                  ` : ''}
              </div>
            
              <div class="home-post-body">
                <span id="post-title-${post.post_id}" class="home-post-title">${post.title}</span>
                <div class="home-post-image">
                  <a href="javascript:void(0)"
                  class="post-image-link"
                  data-post-id="${ post.post_id }"
                  onclick="showPopup(event)">
                    ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" loading="lazy">` : ""}
                  </a>
                </div>
              </div>
              <div class="home-post-footer">
                <span class="no-of-likes"
                data-post-id="${post.post_id}">
                  ${post.likes_count} <i class="fa-solid fa-heart"></i>
                </span>
                <span class="no-of-comments"
                data-post-id="${post.post_id}">
                  ${post.comments_count} <i class="fa-solid fa-comment"></i>
                </span>
              </div>
            </div>
          `;
          document.querySelector(".post-container").insertAdjacentHTML("beforeend", postHtml);
        });
        // Update offset for the next set of posts
        window.offset = window.offset ? window.offset + 2 : 2;
        isLoading = false;

      })
      .catch(error => {
        console.error("Error loading more posts:", error);
        isLoading = false;
      });
  };

  // Handle filter changes
  const filterLinks = document.querySelectorAll('.home-filter-link');
  filterLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const filterType = event.currentTarget.dataset.categoryType; // Get selected filter type

      // If the filter is already applied, prevent reload
      if (currentFilter !== filterType) {
        currentFilter = filterType;

        // Update the URL to reflect the selected filter type
        window.location.href = `/home/${filterType}`;  // Adjust this URL based on your routing setup
      }
    });
  });

  // Infinite scroll functionality
  window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= docHeight - 100) {
      loadMorePosts();
    }
  });
});
