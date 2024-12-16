document.addEventListener('click', function(event) {
  // Check if the clicked element is a post image link
  if (event.target.closest('.post-image-link')) {
    event.preventDefault();
    
    // Get the data attributes from the clicked link
    const postLink = event.target.closest('.post-image-link');
    const postId = postLink.getAttribute('data-post-id');
    const postTitle = postLink.getAttribute('data-post-title');
    const postDescription = postLink.getAttribute('data-post-description');
    const postIngredients = postLink.getAttribute('data-post-ingredients');
    const postOwner = postLink.getAttribute('data-post-owner');
    const postImage = postLink.getAttribute('data-post-image');
    
    // You can now populate the modal with the post details
    const modalTitle = document.querySelector('#postViewModal .modal-title');
    const modalBody = document.querySelector('#postViewModal .modal-body');
    
    modalTitle.textContent = postTitle;
    modalBody.innerHTML = `
      <img src="${postImage}" alt="Post Image" class="modal-post-image">
      <p><strong>Owner:</strong> ${postOwner}</p>
      <p><strong>Description:</strong> ${postDescription}</p>
      <p><strong>Ingredients:</strong> ${postIngredients}</p>
    `;
    
    // Show the modal (assuming you're using Bootstrap, for example)
    const modal = document.getElementById('postViewModal');
    const bootstrapModal = new bootstrap.Modal(modal); // Initialize Bootstrap modal
    bootstrapModal.show();
  }
});
