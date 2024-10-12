let currentPage = 1; // Initialize the current page
const postContainer = document.getElementById("post-container"); // Container for your posts
let loading = false; // Prevent multiple requests while loading
console.log(username);
window.addEventListener("scroll", () => {
  // Check if the user has scrolled to the bottom of the page and not already loading posts
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !loading
  ) {
    loading = true; // Set loading to true to prevent further requests

    currentPage++; // Increment the page number

    // Make an AJAX request to fetch more posts
    fetch(`/profile/${username}/?page=${currentPage}`, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Network response was not ok.");
      })
      .then((html) => {
        // Check if the HTML returned contains any posts
        if (html.trim().length === 0) {
          // No more posts available, stop loading
          window.removeEventListener("scroll", this); // Remove the scroll listener
        } else {
          // Append the new posts to the container
          postContainer.insertAdjacentHTML("beforeend", html);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      })
      .finally(() => {
        loading = false; // Reset loading state once request is complete
      });
  }
});
