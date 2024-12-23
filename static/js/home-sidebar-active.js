document.addEventListener('DOMContentLoaded', function() {
  const filterLinks = document.querySelectorAll('.home-filter-link');
  
  // Get the current filter type from the URL (from the query string or path)
  const pathParts = window.location.pathname.split('/');
  const currentFilter = pathParts[2] || 'all';
  console.log(currentFilter);

  // Loop through filter links and add 'active' to the current filter
  filterLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();

      const filterType = event.currentTarget.dataset.categoryType;
      console.log('FILTER TYPE SA SIDEBAR ACITVE LINK: ', filterType)
      let currentURL = new URL(window.location.href);
      currentURL.searchParams.set('refresh', 'true')
      
      currentURL.pathname = `/home/${filterType}`;

      window.location.href = currentURL.toString();
    })
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