let currentPage = 1; // Initialize the current page
const postContainer = document.getElementById("post-container"); // Container for your posts
let loading = false; // Prevent multiple requests while loading

window.addEventListener("scroll", () => {
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
          return response.text(); // Get the HTML content
        }
        throw new Error("Network response was not ok.");
      })
      .then((html) => {
        // Check if the HTML returned contains any posts
        if (html.trim().length === 0) {
          window.removeEventListener("scroll", this); // No more posts, remove the listener
        } else {
          // Append the new posts to the container
          postContainer.insertAdjacentHTML("beforeend", html);

          // Re-apply like/unlike functionality to the newly added posts
          applyLikeUnlikeButtons(); // Custom function to rebind like buttons
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

// Function to rebind like/unlike buttons after loading new posts
function applyLikeUnlikeButtons() {
  document.querySelectorAll(".like_button").forEach((button) => {
    button.addEventListener("click", function () {
      const postId = this.dataset.postId;
      // Add your like/unlike logic here based on the postId
      // Use fetch or AJAX to handle likes/unlikes
    });
  });
}

// Call this function on initial load to set up like/unlike buttons
applyLikeUnlikeButtons();
