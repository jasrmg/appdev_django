document.addEventListener('DOMContentLoaded', function() {
  const filterLinks = document.querySelectorAll('.filter-link');
  
  // Get the current filter type from the URL (from the query string or path)
  const pathParts = window.location.pathname.split('/');
  const currentFilter = pathParts[2] || 'all';
  console.log(currentFilter);
  // Loop through filter links and add 'active' to the current filter
  filterLinks.forEach(function(link) {
    if (link.getAttribute('data-target') === currentFilter) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Add click listener to toggle active class
  filterLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      filterLinks.forEach(function(link) {
        link.classList.remove('active');
      });
      link.classList.add('active');
    });
  });
});