
// <script>
  // Date Picker Functionality
  document.addEventListener('DOMContentLoaded', function() {
  // Current date
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  // Selected dates
  let checkinDate = null;
  let checkoutDate = null;

  // Guest selection
  let rooms = 1;
  let adults = 2;
  let children = 0;

  // Room booking data
  let selectedRoom = null;
  let selectedPrice = null;

  // Initialize datepickers
  initDatepicker('checkin');
  initDatepicker('checkout');

  // Show checkin datepicker
  document.getElementById('checkin').addEventListener('click', function() {
  toggleDatepicker('checkin');
  hideDatepicker('checkout');
  hideGuestSelector();
});

  // Show checkout datepicker
  document.getElementById('checkout').addEventListener('click', function() {
  toggleDatepicker('checkout');
  hideDatepicker('checkin');
  hideGuestSelector();
});

  // Show guest selector
  document.getElementById('guests').addEventListener('click', function() {
  toggleGuestSelector();
  hideDatepicker('checkin');
  hideDatepicker('checkout');
});

  // Close datepickers when clicking outside
  document.addEventListener('click', function(event) {
  if (!event.target.closest('.datepicker') && !event.target.closest('#checkin') && !event.target.closest('#checkout')) {
  hideDatepicker('checkin');
  hideDatepicker('checkout');
}

  if (!event.target.closest('#guest-selector') && !event.target.closest('#guests')) {
  hideGuestSelector();
}
});

  // Guest selection buttons
  document.getElementById('increase-rooms').addEventListener('click', function() {
  if (rooms < 5) {
  rooms++;
  document.getElementById('room-count').textContent = rooms;
}
});

  document.getElementById('decrease-rooms').addEventListener('click', function() {
  if (rooms > 1) {
  rooms--;
  document.getElementById('room-count').textContent = rooms;
}
});

  document.getElementById('increase-adults').addEventListener('click', function() {
  if (adults < 10) {
  adults++;
  document.getElementById('adult-count').textContent = adults;
}
});

  document.getElementById('decrease-adults').addEventListener('click', function() {
  if (adults > 1) {
  adults--;
  document.getElementById('adult-count').textContent = adults;
}
});

  document.getElementById('increase-children').addEventListener('click', function() {
  if (children < 5) {
  children++;
  document.getElementById('children-count').textContent = children;
}
});

  document.getElementById('decrease-children').addEventListener('click', function() {
  if (children > 0) {
  children--;
  document.getElementById('children-count').textContent = children;
}
});

  // Apply guest selection
  document.getElementById('apply-guests').addEventListener('click', function() {
  let guestText = `${rooms} room${rooms > 1 ? 's' : ''}, ${adults + children} guest${(adults + children) > 1 ? 's' : ''}`;
  document.getElementById('guests').value = guestText;
  hideGuestSelector();
});

  // Book buttons
  document.querySelectorAll('.book-button').forEach(button => {
  button.addEventListener('click', function() {
  selectedRoom = this.getAttribute('data-room');
  selectedPrice = parseInt(this.getAttribute('data-price'));

  if (!checkinDate || !checkoutDate) {
  alert('Please select check-in and check-out dates first');
  return;
}

  // Calculate nights
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const nights = Math.round(Math.abs((checkoutDate - checkinDate) / oneDay));

  // Update confirmation modal
  document.getElementById('confirm-room').textContent = selectedRoom;
  document.getElementById('confirm-checkin').textContent = formatDate(checkinDate);
  document.getElementById('confirm-checkout').textContent = formatDate(checkoutDate);
  document.getElementById('confirm-guests').textContent = `${rooms} room${rooms > 1 ? 's' : ''}, ${adults} adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}`;
  document.getElementById('confirm-nights').textContent = nights;
  document.getElementById('confirm-price').textContent = `$${selectedPrice}`;
  document.getElementById('confirm-total').textContent = `$${selectedPrice * nights}`;

  // Show modal
  document.getElementById('confirmation-modal').classList.add('show');
});
});

  // Close modal
  document.getElementById('close-modal').addEventListener('click', function() {
  document.getElementById('confirmation-modal').classList.remove('show');
});

  document.getElementById('cancel-booking').addEventListener('click', function() {
  document.getElementById('confirmation-modal').classList.remove('show');
});

  // Confirm booking
  document.getElementById('confirm-booking').addEventListener('click', function() {
  alert('Booking confirmed! Thank you for choosing Luxury Haven.');
  document.getElementById('confirmation-modal').classList.remove('show');
});

  // Search button
  document.getElementById('search-button').addEventListener('click', function() {
  if (!checkinDate || !checkoutDate) {
  alert('Please select check-in and check-out dates');
  return;
}

  // In a real app, this would filter available rooms based on dates
  alert('Showing available rooms for your selected dates');
});

  // Helper functions
  function initDatepicker(type) {
  renderCalendar(type, currentMonth, currentYear);

  // Navigation buttons
  document.getElementById(`${type}-prev-month`).addEventListener('click', function() {
  currentMonth--;
  if (currentMonth < 0) {
  currentMonth = 11;
  currentYear--;
}
  renderCalendar(type, currentMonth, currentYear);
});

  document.getElementById(`${type}-next-month`).addEventListener('click', function() {
  currentMonth++;
  if (currentMonth > 11) {
  currentMonth = 0;
  currentYear++;
}
  renderCalendar(type, currentMonth, currentYear);
});
}

  function renderCalendar(type, month, year) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  document.getElementById(`${type}-month-year`).textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let daysHtml = '';

  // Previous month days
  for (let i = 0; i < firstDay; i++) {
  daysHtml += `<div class="datepicker-day disabled">${new Date(year, month, 0).getDate() - firstDay + i + 1}</div>`;
}

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
  const dayDate = new Date(year, month, i);
  let dayClass = 'datepicker-day';

  // Disable past dates
  if (dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
  dayClass += ' disabled';
}

  // Highlight selected date
  if (type === 'checkin' && checkinDate && dayDate.getTime() === checkinDate.getTime()) {
  dayClass += ' selected';
} else if (type === 'checkout' && checkoutDate && dayDate.getTime() === checkoutDate.getTime()) {
  dayClass += ' selected';
}

  daysHtml += `<div class="${dayClass}" data-day="${i}">${i}</div>`;
}

  // Next month days to complete the grid
  const totalCells = 42; // 6 rows x 7 days
  const remainingCells = totalCells - (firstDay + daysInMonth);
  for (let i = 1; i <= remainingCells; i++) {
  daysHtml += `<div class="datepicker-day disabled">${i}</div>`;
}

  document.getElementById(`${type}-days`).innerHTML = daysHtml;

  // Add click event to days
  document.querySelectorAll(`#${type}-days .datepicker-day:not(.disabled)`).forEach(day => {
  day.addEventListener('click', function() {
  const dayNum = parseInt(this.getAttribute('data-day'));
  const selectedDate = new Date(year, month, dayNum);

  if (type === 'checkin') {
  checkinDate = selectedDate;
  document.getElementById('checkin').value = formatDate(selectedDate);

  // If checkout is before checkin, reset checkout
  if (checkoutDate && checkoutDate <= checkinDate) {
  checkoutDate = null;
  document.getElementById('checkout').value = '';
}
} else {
  // Only allow checkout after checkin
  if (checkinDate && selectedDate > checkinDate) {
  checkoutDate = selectedDate;
  document.getElementById('checkout').value = formatDate(selectedDate);
} else if (!checkinDate) {
  alert('Please select check-in date first');
} else {
  alert('Check-out date must be after check-in date');
}
}

  hideDatepicker(type);
});
});
}

  function toggleDatepicker(type) {
  const datepicker = document.getElementById(`${type}-datepicker`);
  if (datepicker.classList.contains('show')) {
  datepicker.classList.remove('show');
} else {
  datepicker.classList.add('show');
}
}

  function hideDatepicker(type) {
  document.getElementById(`${type}-datepicker`).classList.remove('show');
}

  function toggleGuestSelector() {
  const selector = document.getElementById('guest-selector');
  if (selector.classList.contains('hidden')) {
  selector.classList.remove('hidden');
} else {
  selector.classList.add('hidden');
}
}

  function hideGuestSelector() {
  document.getElementById('guest-selector').classList.add('hidden');
}

  function formatDate(date) {
  if (!date) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
});
{/*</script>*/}
