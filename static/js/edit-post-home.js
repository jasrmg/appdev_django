// document.addEventListener("DOMContentLoaded", () => {
//   // Get modal and form elements
//   const modal = document.getElementById("editPost");
//   const closeModalBtn = document.getElementById("editPostX");
//   const form = document.getElementById("editPostForm");

//   // Event listener to open the modal and populate fields
//   document.querySelectorAll(".edit-icon").forEach((button) => {
//     button.addEventListener("click", function () {
//       // Get post data from data attributes
//       const postId = this.getAttribute("data-post-id");
//       const postTitle = this.getAttribute("data-post-title");
//       const postCategory = this.getAttribute("data-post-category");
//       const postDescription = this.getAttribute("data-post-description");
//       const postIngredients = this.getAttribute("data-post-ingredients");

//       // Populate modal fields
//       document.getElementById("editPostTitle").value = postTitle;
//       document.getElementById("editPostCategory").value = postCategory;
//       document.getElementById("editPostDescription").value = postDescription;
//       document.getElementById("editPostIngredients").value = postIngredients;

//       // Add the post ID as a hidden field
//       form.setAttribute("data-post-id", postId);

//       // Show the modal
//       modal.style.display = "block";
//     });
//   });

//   // Event listener to close the modal
//   closeModalBtn.addEventListener("click", () => {
//     modal.style.display = "none";
//   });

//   // Submit the form via AJAX
//   form.addEventListener("submit", function (e) {
//     e.preventDefault(); // Prevent default form submission

//     // Gather form data
//     const postId = form.getAttribute("data-post-id");
//     const formData = {
//       post_id: postId,
//       title: document.getElementById("editPostTitle").value,
//       category_id: document.getElementById("editPostCategory").value,
//       description: document.getElementById("editPostDescription").value,
//       ingredients: document.getElementById("editPostIngredients").value,
//     };

//     // Send AJAX request
//     fetch('edit-post/', {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": window.csrfToken,
//       },
//       body: JSON.stringify(formData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           alert("Post updated successfully!");

//           // Update the post on the page dynamically (optional)
//           const postContainer = document.getElementById(`post-${postId}`);
//           postContainer.querySelector(".home-post-title").innerText = formData.title;
//           postContainer.querySelector(".post-description").innerText = formData.description;
//           postContainer.querySelector(".post-ingredients").innerText = formData.ingredients;

//           // Close the modal
//           modal.style.display = "none";
//         } else {
//           alert("Failed to update post: " + data.message);
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         alert("An error occurred while updating the post.");
//       });
//   });

//   // Close the modal if the user clicks outside of it
//   window.addEventListener("click", (e) => {
//     if (e.target === modal) {
//       modal.style.display = "none";
//     }
//   });
// });
