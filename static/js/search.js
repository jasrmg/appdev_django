document.addEventListener('DOMContentLoaded', function() {
  // Script for show more users
  function toggleUsers() {
    // Select all users and the toggle button
    const userItems = document.querySelectorAll('.user-item');
    const toggleButton = document.getElementById('toggle-btn');
    const allFilter = document.getElementById('all-filter');
    const peopleFilter = document.getElementById('people-filter');

    if (!toggleButton) {
      console.error("Toggle button not found!");
      return;
    }

    // Find all currently visible user items
    const visibleItems = Array.from(userItems).filter(item => !item.classList.contains('hidden'));

    // If there are more hidden users, show the next 3 users
    if (visibleItems.length < userItems.length) {
      const nextItems = Array.from(userItems).slice(visibleItems.length, visibleItems.length + 3);
      nextItems.forEach(item => item.classList.remove('hidden'));

      // If all items are visible, change the button text to 'See Less'
      if (visibleItems.length + 3 >= userItems.length) {
        toggleButton.textContent = 'See Less';
      } else {
        toggleButton.textContent = 'See More';
      }

      // Move highlight from 'All' to 'People' in the filters
      allFilter.classList.remove('active');
      peopleFilter.classList.add('active');
    } else {
      // If all items are visible, hide users beyond the first 3 and change the button text to 'See More'
      userItems.forEach((item, index) => {
        if (index >= 3) item.classList.add('hidden');
      });
      toggleButton.textContent = 'See More';

      // Move highlight back to 'All' filter
      peopleFilter.classList.remove('active');
      allFilter.classList.add('active');
    }

    // Optionally adjust the section height after visibility change
    const section = document.getElementById('user-results');
    // You can add height adjustments here if needed, e.g., scroll the section into view
  }

  // Add the event listener to the button
  const toggleButton = document.getElementById('toggle-btn');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleUsers);
  }
});
