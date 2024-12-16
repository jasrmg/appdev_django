// document.addEventListener('DOMContentLoaded', function () {
//   const filterLinks = document.querySelectorAll('.filter-link'); // All filter links
//   const userResults = document.querySelector('.user-results'); // User results container
//   const postResults = document.querySelector('.search-food-results'); // Post results container

//   // Add click event listener to each filter link
//   filterLinks.forEach(link => {
//     link.addEventListener('click', function (event) {
//       event.preventDefault(); // Prevent default link behavior

//       // Check if the clicked link is for a category
//       const categoryName = this.getAttribute('data-target');
//       if (categoryName) {
//         // Redirect to the category filter URL
//         window.location.href = `/search/${categoryName}/`; // Adjust path as needed based on your URL pattern
//       } else {
//         // For All, People, and Posts
//         filterLinks.forEach(l => l.classList.remove('active')); // Remove active class from all links
//         this.classList.add('active'); // Add active class to the clicked link

//         // Reset visibility classes
//         userResults.classList.add('hidden');
//         postResults.classList.add('hidden');

//         // Show the relevant section(s)
//         const target = this.getAttribute('data-target');
//         if (target === 'people') {
//           userResults.classList.remove('hidden');
//         } else if (target === 'posts') {
//           postResults.classList.remove('hidden');
//         } else {
//           // Show both containers for "All"
//           userResults.classList.remove('hidden');
//           postResults.classList.remove('hidden');
//         }
//       }
//     });
//   });
// });


// document.addEventListener('DOMContentLoaded', () => {
//   const filterLinks = document.querySelectorAll('.filter-link');
//   const postsContainer = document.querySelector('.search-food-results');
//   const toggleBtnPost = document.getElementById('toggle-btn-post');

//   let currentCategory = 'all';  // Default category
//   let offset = 0;  // Initial offset for pagination
//   const limit = 2; // Posts per load

//   function fetchPosts(category, reset = false) {
//       // If reset is true, reset the container and offset
//       if (reset) {
//           postsContainer.innerHTML = ''; // Clear posts
//           offset = 0; // Reset offset
//       }

//       fetch(`/filter-posts?category=${category}&offset=${offset}`)
//           .then(response => response.json())
//           .then(data => {
//               // Append new posts
//               data.posts.forEach(post => {
//                 const postHTML = `
//                   <div class="search-post">
//                     <!--post header-->
//                     <div class="search-post-header">
//                       <div class="search-post-owner">
//                         <div class="search-avatar-image">
//                           <img src="${post.avatar}" alt="${post.username}" loading="lazy">
//                         </div>
//                         <div class="search-post-owner-details">
//                           <span class="owner-name">${post.full_name}</span>
//                           <span class="post-date">${post.time_since} ago</span>
//                         </div>
//                       </div>
//                       ${post.isOwnPost ? `
//                         <div class="search-post-actions">
//                           <button class="edit-icon" title="${post.title}"
//                             id="openEditPostModalBtn"
//                             data-post-id="${post.post_id}"
//                             data-post-category="${post.category_id}"
//                             data-post-description="${post.description}"
//                             data-post-ingredients="${post.ingredients}">
//                             <i class="fa-solid fa-pencil-alt" title="Edit"></i>
//                           </button>
            
//                           <button class="delete-post-button" title="Delete Post"
//                             id="deletePostModalBtn" 
//                             data-post-id="${post.post_id}"
//                             data-next="${window.location.pathname}?q=${new URLSearchParams(window.location.search).get('q')}">
//                             &times;
//                           </button>
//                         </div>
//                       ` : ''}
//                     </div>
            
//                     <!--post body-->
//                     <div class="search-post-body">
//                       <span class="search-post-title">${post.title}</span>
//                       <div class="search-post-image">
//                         ${post.images.map(image => `<img src="${image}" alt="post-image" loading="lazy">`).join('')}
//                       </div>
//                     </div>
            
//                     <!--post footer-->
//                     <div class="search-post-footer">
//                       <span class="no-of-likes">
//                         ${post.likes} 
//                         <i class="fa-solid fa-heart"></i>
//                       </span>
//                       <span class="no-of-comments">
//                         ${post.comments} 
//                         <i class="fa-solid fa-comment"></i>  
//                       </span>
//                     </div>
//                   </div>
//                 `;
//                 postsContainer.insertAdjacentHTML('beforeend', postHTML);
//             });
            

//               // If no more posts, hide the toggle button
//               if (!data.has_more) {
//                   toggleBtnPost.style.display = 'none';
//               } else {
//                   toggleBtnPost.style.display = 'block';
//               }

//               offset += limit; // Increment offset
//           });
//   }

//   // Handle category clicks
//   filterLinks.forEach(link => {
//       link.addEventListener('click', (e) => {
//           e.preventDefault();

//           // Update active link styling
//           filterLinks.forEach(link => link.classList.remove('active'));
//           link.classList.add('active');

//           // Update current category and fetch posts
//           currentCategory = link.dataset.target;
//           fetchPosts(currentCategory, true); // Reset previous posts
//       });
//   });

//   // Handle "See More" button click
//   toggleBtnPost.addEventListener('click', () => {
//       fetchPosts(currentCategory); // Load more posts for current category
//   });

//   // Initial fetch for default category
//   fetchPosts(currentCategory, true);
// });
// document.addEventListener('DOMContentLoaded', function () {
//   const filterLinks = document.querySelectorAll('.filter-link');
//   const postsContainer = document.querySelector('.search-food-results');
//   const toggleBtnPost = document.getElementById('toggle-btn-post');

//   let currentCategory = 'all';  // Default category
//   let offset = 0;  // Initial offset for pagination
//   const limit = 2; // Posts per load

//   // Function to fetch posts for a specific category
//   function fetchPosts(category, reset = false) {
//       // If reset is true, reset the container and offset
//       if (reset) {
//           postsContainer.innerHTML = ''; // Clear posts
//           offset = 0; // Reset offset
//       }

//       fetch(`/filter-posts?category=${category}&offset=${offset}`)
//           .then(response => response.json())
//           .then(data => {
//               // Append new posts
//               data.posts.forEach(post => {
//                 const postHTML = `
//                   <div class="search-post">
//                     <!--post header-->
//                     <div class="search-post-header">
//                       <div class="search-post-owner">
//                         <div class="search-avatar-image">
//                           <img src="${post.avatar}" alt="${post.username}" loading="lazy">
//                         </div>
//                         <div class="search-post-owner-details">
//                           <span class="owner-name">${post.full_name}</span>
//                           <span class="post-date">${post.time_since} ago</span>
//                         </div>
//                       </div>
//                     </div>
            
//                     <!--post body-->
//                     <div class="search-post-body">
//                       <span class="search-post-title">${post.title}</span>
//                       <div class="search-post-image">
//                         ${post.images.map(image => `<img src="${image}" alt="post-image" loading="lazy">`).join('')}
//                       </div>
//                     </div>
            
//                     <!--post footer-->
//                     <div class="search-post-footer">
//                       <span class="no-of-likes">
//                         ${post.likes} 
//                         <i class="fa-solid fa-heart"></i>
//                       </span>
//                       <span class="no-of-comments">
//                         ${post.comments} 
//                         <i class="fa-solid fa-comment"></i>  
//                       </span>
//                     </div>
//                   </div>
//                 `;
//                 postsContainer.insertAdjacentHTML('beforeend', postHTML);
//             });

//             // If no more posts, hide the toggle button
//             if (!data.has_more) {
//                 toggleBtnPost.style.display = 'none';
//             } else {
//                 toggleBtnPost.style.display = 'block';
//             }

//             offset += limit; // Increment offset
//         });
//   }

//   // Handle "See More" button click
//   toggleBtnPost.addEventListener('click', () => {
//       fetchPosts(currentCategory); // Load more posts for current category
//   });

//   // Handle category clicks
//   filterLinks.forEach(link => {
//     link.addEventListener('click', function (event) {
//       event.preventDefault(); // Prevent default link behavior

//       // Remove active class from all links
//       filterLinks.forEach(l => l.classList.remove('active'));

//       // Add active class to the clicked link
//       this.classList.add('active');

//       // Get the target from the clicked link
//       const target = this.getAttribute('data-target');

//       // Reset visibility classes
//       userResults.classList.add('hidden');
//       postResults.classList.add('hidden');

//       // Show the relevant section(s)
//       if (target === 'people') {
//         userResults.classList.remove('hidden');
//       } else if (target === 'posts') {
//         postResults.classList.remove('hidden');
//         fetchPosts(currentCategory, true); // Fetch posts based on the current category
//       } else {
//         // Show both containers for "All"
//         userResults.classList.remove('hidden');
//         postResults.classList.remove('hidden');
//         fetchPosts(currentCategory, true); // Fetch posts based on the current category
//       }
//     });
//   });

//   // Initial fetch for default category
//   fetchPosts(currentCategory, true);
// });
