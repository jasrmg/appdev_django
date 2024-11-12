// Open and close modal functions
function openModal() {
  document.getElementById('changePasswordModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('changePasswordModal').style.display = 'none';
}

document.getElementById('closeChangePasswordModal').onclick = closeModal;

// Toggle password visibility
function togglePassword(fieldId) {
  const passwordField = document.getElementById(fieldId);
  const icon = passwordField.nextElementSibling;
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  } else {
    passwordField.type = 'password';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  }
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById('changePasswordModal');
  if (event.target === modal) {
    closeModal();
  }
};