document.addEventListener("DOMContentLoaded", function () {
    // Check if the page is being loaded or reloaded
    if (performance.navigation.type == 1) {
      // If it's a reload (F5 or reload button), add `refresh=true` to the URL
      const url = new URL(window.location.href);
      if (!url.searchParams.has('refresh')) {
        url.searchParams.set('refresh', 'true');
        window.location.href = url.toString();  // Redirect to the new URL with `refresh=true`
      }
  }
  console.log(window.loadMorePostURL)
  let isLoading = false; 
  let noMorePosts = false;
  const loadMorePosts = () => {
    if ( noMorePosts | isLoading) return;

    isLoading = true;
    fetch(window.loadMorePostURL, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log('no more posts: ', data.no_more_posts)
      //append a new div at the bottom ugma na lang
      if (data.no_more_posts) {
        const end = document.querySelector('.no-more-post');
        console.log('end? ', end);
        if (end) {
          isLoading = false;
          return;
        }
        //create the div for no more posts to show.
        const noMorePostsDiv = document.createElement('div');
        noMorePostsDiv.className = 'home-post no-more-post';
        noMorePostsDiv.innerHTML = `
        <span class="no-more-post">
          No more post to load.
        </span>
        `
        document.querySelector('.post-container').appendChild(noMorePostsDiv);
        isLoading = false;
        return;
      }
      data.posts_data.forEach(post => {
        const timeAgo = window.timeSince(post.created_at)
        console.log('TIME: ', timeAgo)
        console.log('?: ', post.same_user)
        const postHtml = `
          <div class="home-post" id="${post.post_id}">
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
                <button class="edit-icon" title="${post.title}"
                id="openEditPostModalBtn"
                data-post-id="${post.post_id}"
                data-post-category="${post.category_id}"
                data-post-ingredients="${post.ingredients}">
                  <i class="fas fa-edit" title="Edit"> </i>
                </button>
                <button class="delete-post-button" title="Delete"
                id="deletePostModalBtn"
                data-post-id="${post.post_id}
                data-next="${post.path}>
                  &times;
                </button>
              </div>
                ` : ''}
            </div>
          
            <div class="home-post-body">
              <span class="home-post-title">${post.title}</span>
              <div class="home-post-image">
                <a href="javascript:void(0)"
                class="post-image-link"
                data-post-id="{{ post.post_id }}
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
      isLoading = false;
    })
    .catch(error => {
      console.error("Error loading more posts:", error);
      isLoading = false;
    });
  };

  window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= docHeight - 100) {
      loadMorePosts();
    }
  });
});