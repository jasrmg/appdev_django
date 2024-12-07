document.addEventListener('DOMContentLoaded', function() {
  // SEARCH SUGGESTION
  const searchInput = document.getElementById('search-input');
  const suggestionsDiv = document.getElementById('suggestions');
      
  searchInput.addEventListener('input', () => {
    const query = searchInput.value; // Keep the full query without trimming
    if (query.length > 0) {
      fetch(`/search_suggestions/?q=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        suggestionsDiv.innerHTML = '';
        // Display the suggestions
        data.results.forEach(user => {
        const suggestion = document.createElement('div');
        suggestion.innerHTML = `
          <a href="/profile/${user.username}" class="suggestion-link">
            <img src="${user.avatar}" alt="${user.username}" class="suggestion-avatar">
            <span>${user.first_name} ${user.last_name}</span>
          </a>
          `;
        suggestionsDiv.appendChild(suggestion);
      });
              
    // Display the custom search query at the bottom
    const customSearch = document.createElement('div');
    customSearch.innerHTML = `
      <a href="/search/?q=${encodeURIComponent(query)}" class="custom-search-link">
        <div class="suggestion-search">
          <i class="fas fa-search"></i>
        </div>
        <span>${query}</span>
      </a>
      `;
    suggestionsDiv.appendChild(customSearch);
    });
      } else {
        suggestionsDiv.innerHTML = ''; // Clear suggestions if query is empty
      }
    });
    //dont allow to search if its empty
    document.getElementById("search-form").addEventListener("submit", function(event) {
    //get the input field
    if (searchInput.value.trim() === "") {
      event.preventDefault();
    }
  });



  // SCRIPT FOR SHOW MORE USERS
  function toggleUsers() {
    // Select all users and the toggle button
    const userItems = document.querySelectorAll('.user-item');
    const toggleButton = document.getElementById('toggle-btn');
    const allFilter = document.getElementById('all-filter');
    const peopleFilter = document.getElementById('people-filter');

    // Find all currently visible user items
    const visibleItems = Array.from(userItems).filter(item => !item.classList.contains('hidden'));

    // If there are more hidden users, show the next 3 users
    if (visibleItems.length < userItems.length) {
      const nextItems = Array.from(userItems).slice(visibleItems.length, visibleItems.length + 3);
      nextItems.forEach(item => item.classList.remove('hidden'));

      // If all items are visible, change the button text to 'See Less'
      if (visibleItems.length + 3 >= userItems.length) {
        toggleButton.textContent = 'See Less';
      } else {
        toggleButton.textContent = 'See More';
      }

      // Move highlight from 'All' to 'People' in the filters
      allFilter.classList.remove('active');
      peopleFilter.classList.add('active');
    } else {
      // If all items are visible, hide users beyond the first 3 and change the button text to 'See More'
      userItems.forEach((item, index) => {
        if (index >= 3) item.classList.add('hidden');
      });
      toggleButton.textContent = 'See More';

      // Move highlight back to 'All' filter
      peopleFilter.classList.remove('active');
      allFilter.classList.add('active');
    }
    // scroll to the button and focus on it
    toggleButton.scrollIntoView({behavior:'smooth', block:'center'});
  }

  // Add the event listener to the button
  const toggleButton = document.getElementById('toggle-btn');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleUsers);
  }
  
  //SCRIPT FOR SHOW MORE POSTS
  const togglePostBtn = document.getElementById('toggle-btn-post');
  const posts = document.querySelectorAll('.search-post');
  //initially hide posts after the first 2:
  posts.forEach((post, index) => {
    if (index >= 2) {
      post.classList.add('hidden');
    }
  });
  //toggle button functionality
  togglePostBtn.addEventListener('click', function() {
    const hiddenPosts = document.querySelectorAll('.search-post.hidden');

    if (hiddenPosts.length > 0) {
      for (let i = 0; i < 2 && hiddenPosts[i]; i++) {
        hiddenPosts[i].classList.remove('hidden');
      }
      //if there are no more hidden posts, change the button text to see less
      if (document.querySelectorAll('.search-post.hidden').length === 0) {
        togglePostBtn.textContent = 'See Less';
      }
    } else {
      //hide all posts after the first 2
      posts.forEach((post, index) => {
        if (index > 2) {
          post.classList.add('hidden');
        }
      });
      togglePostBtn.textContent = 'See More';
    }
  })



  //PUT ACTIVE ON THE POSTS IF H2 HEADING IS REACHED:
  // window.addEventListener('scroll', function() {
  //   const postHeading = document.getElementById('post-heading');
  //   const postsFilterLink = document.getElementById('posts-filter');
  //   const allFilterLink = document.getElementById('all-filter');
  //   const peopleFilterLink = document.getElementById('people-filter');

  //   //get the position of the posts heading relative to the top of the viewport
  //   const rect = postHeading.getBoundingClientRect();
  //   console.log(rect);

  //   const peopleHeading = document.getElementById('people-heading');
  //   const peopleRect = peopleHeading ? peopleHeading.getBoundingClientRect() : null;

  //   //remove active class from all filters
  //   document.querySelectorAll('.filters a').forEach(filterLink => {
  //     filterLink.classList.remove('active');
  //   });
  //   //check if the posts section is in the viewport
  //   const isPostsVisible = rect.top >= 0 && rect.top <= window.innerHeight * 0.5 && rect.bottom <= window.innerHeight;

  //   if (isPostsVisible) {
  //     postsFilterLink.classList.add('active');
  //   } else {
  //     allFilterLink.classList.add('active');
  //   }

  //   //check if the people section is in the viewport
  //   if (peopleRect) {
  //     const isPeopleVisible = peopleRect.top >= 0 && peopleRect.top <= window.innerHeight * 0.5 && peopleRect.bottom <= window.innerHeight;
  //     if (isPeopleVisible) {
  //       peopleFilterLink.add('active');
  //     }
  //   }
  // });
  

  //ajax for follow/unfollow in search view:
  document.querySelectorAll('.search-follow-btn').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const username = button.getAttribute('data-username');
      console.log(username)
      const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      console.log('csrf token: ', csrfToken);
      fetch(`/follow/${username}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
      })
      .then(response => {
        if(!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        button.textContent = data.following ? 'Unfollow' : 'Follow';
        //update the person container span follower count
        const personContainer = button.closest('.person');
        const followerCountElement = personContainer.querySelector('.search-follower-count');
        if (followerCountElement) {
          followerCountElement.textContent = data.follower_count + (data.follower_count > 1 ? ' followers' : ' follower');
        }
      }).catch(error => {
        console.error('There was a problem: ', error);
      })
    })
  });
});
