document.addEventListener('DOMContentLoaded', function () {
  const filterLinks = document.querySelectorAll('.filter-link'); // All filter links
  const userResults = document.querySelector('.user-results'); // User results container
  const postResults = document.querySelector('.search-food-results'); // Post results container

  // Add click event listener to each filter link
  filterLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default link behavior

      // Remove active class from all links
      filterLinks.forEach(l => l.classList.remove('active'));

      // Add active class to the clicked link
      this.classList.add('active');

      // Get the target from the clicked link
      const target = this.getAttribute('data-target');

      // Reset visibility classes
      userResults.classList.add('hidden');
      postResults.classList.add('hidden');

      // Show the relevant section(s)
      if (target === 'people') {
        userResults.classList.remove('hidden');
      } else if (target === 'posts') {
        postResults.classList.remove('hidden');
      } else {
        // Show both containers for "All"
        userResults.classList.remove('hidden');
        postResults.classList.remove('hidden');
      }
    });
  });
});
