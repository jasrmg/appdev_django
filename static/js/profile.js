// JavaScript functions for opening/closing modals
function openModal() {
  document.getElementById('editProfileModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('editProfileModal').style.display = 'none';
}

function openPostModal() {
  const modal = document.getElementById("createPostModal");
  modal.style.display = "flex"; // Change to flex to ensure centering
}

function closePostModal() {
  const modal = document.getElementById("createPostModal");
  modal.style.display = "none"; // Hide the modal
}



// Close the modal when clicking outside of it
window.onclick = function(event) {
  if (event.target == document.getElementById('editProfileModal')) {
    closeModal();
  }
  if (event.target == document.getElementById('createPostModal')) {
    closePostModal();
  }
}

// Prevent automatic opening of modals on page load
document.addEventListener('DOMContentLoaded', function() {
  // Ensure modals are hidden on initial load
  document.getElementById('editProfileModal').style.display = 'none';
  document.getElementById('createPostModal').style.display = 'none';
});
