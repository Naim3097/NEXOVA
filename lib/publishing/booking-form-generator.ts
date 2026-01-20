import type { Element } from '@/types';

/**
 * Sanitize element ID for use in JavaScript identifiers
 */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Generate Booking Form HTML
 */
export function generateBookingFormHTML(element: Element): string {
  const props = element.props as any;
  const title = props.title || 'Book an Appointment';
  const description = props.description || 'Select your preferred date and time slot';
  const nameLabel = props.nameLabel || 'Full Name';
  const phoneLabel = props.phoneLabel || 'Phone Number';
  const emailLabel = props.emailLabel || 'Email';
  const remarkLabel = props.remarkLabel || 'Notes / Remarks';
  const showName = props.showName !== false;
  const showPhone = props.showPhone !== false;
  const showEmail = props.showEmail !== false;
  const showRemark = props.showRemark !== false;
  const nameRequired = props.nameRequired !== false;
  const phoneRequired = props.phoneRequired !== false;
  const emailRequired = props.emailRequired !== false;
  const remarkRequired = props.remarkRequired === true;
  const defaultCountryCode = props.defaultCountryCode || 'MY';
  const serviceName = props.serviceName || 'Consultation';
  const servicePrice = props.servicePrice || 0;
  const currency = props.currency || 'MYR';
  const duration = props.duration || 60;
  const slotDuration = props.slotDuration || 60;
  const startTime = props.startTime || '09:00';
  const endTime = props.endTime || '18:00';
  const availableDays = props.availableDays || [1, 2, 3, 4, 5];
  const blockedDates = props.blockedDates || [];
  const submitButtonText = props.submitButtonText || 'Confirm Booking';
  const submitButtonColor = props.submitButtonColor || '#2563eb';
  const bgColor = props.bgColor || '#ffffff';
  const google_sheets_enabled = props.google_sheets_enabled || false;
  const google_sheets_url = props.google_sheets_url || '';
  const requirePayment = props.requirePayment || false;
  const termsUrl = props.termsUrl || '#';
  const policyUrl = props.policyUrl || '#';

  const sanitizedId = sanitizeId(element.id);

  // Format currency helper
  const formatPrice = (value: number): string => {
    if (currency === 'MYR') {
      return 'RM ' + value.toFixed(2);
    }
    return currency + ' ' + value.toFixed(2);
  };

  // Generate time slots HTML
  const generateTimeSlots = (): string => {
    const slots: string[] = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;
    let slotId = 1;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = currentHour.toString().padStart(2, '0') + ':' + currentMin.toString().padStart(2, '0');
      slots.push(
        '<button type="button" class="time-slot" data-slot-id="slot-' + slotId + '" data-time="' + timeStr + '" style="padding: 0.5rem 0.75rem; font-size: 0.875rem; border-radius: 0.5rem; border: 1px solid #d1d5db; background: white; color: #374151; cursor: pointer; transition: all 0.2s;">' + timeStr + '</button>'
      );

      currentMin += slotDuration;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
      slotId++;
    }

    return slots.join('');
  };

  // Generate country code options
  const countryCodes = [
    { code: 'MY', dial: '+60', flag: '🇲🇾' },
    { code: 'SG', dial: '+65', flag: '🇸🇬' },
    { code: 'ID', dial: '+62', flag: '🇮🇩' },
    { code: 'TH', dial: '+66', flag: '🇹🇭' },
    { code: 'PH', dial: '+63', flag: '🇵🇭' },
    { code: 'VN', dial: '+84', flag: '🇻🇳' },
    { code: 'US', dial: '+1', flag: '🇺🇸' },
    { code: 'GB', dial: '+44', flag: '🇬🇧' },
  ];

  const countryOptions = countryCodes.map(c =>
    '<option value="' + c.code + '"' + (c.code === defaultCountryCode ? ' selected' : '') + '>' + c.flag + ' ' + c.dial + '</option>'
  ).join('');

  // Build the HTML
  let html = '<section id="booking-' + sanitizedId + '" style="background-color: ' + bgColor + '; padding: 2rem 1rem;">';
  html += '<div style="max-width: 48rem; margin: 0 auto;">';

  // Header
  if (title || description) {
    html += '<div style="text-align: center; margin-bottom: 2rem;">';
    if (title) {
      html += '<h2 style="font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0 0 0.5rem 0;">' + title + '</h2>';
    }
    if (description) {
      html += '<p style="color: #6b7280; margin: 0;">' + description + '</p>';
    }
    html += '</div>';
  }

  // Form
  html += '<form id="booking-form-' + sanitizedId + '" style="background: white; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); overflow: hidden;">';

  // Service Info Header
  html += '<div style="background: linear-gradient(to right, #3b82f6, #2563eb); color: white; padding: 1.5rem;">';
  html += '<div style="display: flex; justify-content: space-between; align-items: center;">';
  html += '<div>';
  html += '<h3 style="font-size: 1.25rem; font-weight: 600; margin: 0;">' + serviceName + '</h3>';
  html += '<p style="color: rgba(219, 234, 254, 1); display: flex; align-items: center; gap: 0.5rem; margin: 0.25rem 0 0 0; font-size: 0.875rem;">';
  html += '<svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
  html += duration + ' minutes</p>';
  html += '</div>';
  if (servicePrice > 0) {
    html += '<div style="text-align: right;">';
    html += '<p style="font-size: 0.75rem; color: rgba(219, 234, 254, 1); margin: 0;">Price</p>';
    html += '<p style="font-size: 1.5rem; font-weight: 700; margin: 0;">' + formatPrice(servicePrice) + '</p>';
    html += '</div>';
  }
  html += '</div></div>';

  // Form Fields Container
  html += '<div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">';

  // Customer Info Section
  html += '<div style="display: flex; flex-direction: column; gap: 1rem;">';
  html += '<h4 style="font-size: 0.75rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">Your Information</h4>';

  // Name Field
  if (showName) {
    html += '<div>';
    html += '<label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.375rem;">';
    html += '<span style="display: flex; align-items: center; gap: 0.5rem;">';
    html += '<svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
    html += nameLabel;
    if (nameRequired) html += '<span style="color: #ef4444;">*</span>';
    html += '</span></label>';
    html += '<input type="text" name="name"' + (nameRequired ? ' required' : '') + ' style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box;" placeholder="Enter your full name" />';
    html += '</div>';
  }

  // Phone Field
  if (showPhone) {
    html += '<div>';
    html += '<label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.375rem;">';
    html += '<span style="display: flex; align-items: center; gap: 0.5rem;">';
    html += '<svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>';
    html += phoneLabel;
    if (phoneRequired) html += '<span style="color: #ef4444;">*</span>';
    html += '</span></label>';
    html += '<div style="display: flex;">';
    html += '<select name="country_code" style="padding: 0.75rem; border: 1px solid #d1d5db; border-right: none; border-radius: 0.5rem 0 0 0.5rem; background: #f9fafb; font-size: 1rem;">' + countryOptions + '</select>';
    html += '<input type="tel" name="phone"' + (phoneRequired ? ' required' : '') + ' style="flex: 1; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0 0.5rem 0.5rem 0; font-size: 1rem; box-sizing: border-box;" placeholder="012-345 6789" />';
    html += '</div></div>';
  }

  // Email Field
  if (showEmail) {
    html += '<div>';
    html += '<label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.375rem;">';
    html += '<span style="display: flex; align-items: center; gap: 0.5rem;">';
    html += '<svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>';
    html += emailLabel;
    if (emailRequired) html += '<span style="color: #ef4444;">*</span>';
    html += '</span></label>';
    html += '<input type="email" name="email"' + (emailRequired ? ' required' : '') + ' style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box;" placeholder="your@email.com" />';
    html += '</div>';
  }

  // Remark Field
  if (showRemark) {
    html += '<div>';
    html += '<label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.375rem;">';
    html += '<span style="display: flex; align-items: center; gap: 0.5rem;">';
    html += '<svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
    html += remarkLabel;
    if (remarkRequired) html += '<span style="color: #ef4444;">*</span>';
    html += '</span></label>';
    html += '<textarea name="remark"' + (remarkRequired ? ' required' : '') + ' rows="3" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; resize: none; box-sizing: border-box;" placeholder="Any special requests or notes..."></textarea>';
    html += '</div>';
  }
  html += '</div>';

  // Calendar Section
  html += '<div style="display: flex; flex-direction: column; gap: 1rem;">';
  html += '<h4 style="font-size: 0.75rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; display: flex; align-items: center; gap: 0.5rem;">';
  html += '<svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
  html += 'Select Date</h4>';
  html += '<div id="calendar-' + sanitizedId + '" style="border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem;"></div>';
  html += '<input type="hidden" name="selected_date" id="selected-date-' + sanitizedId + '" required />';
  html += '</div>';

  // Time Slots Section
  html += '<div style="display: flex; flex-direction: column; gap: 1rem;">';
  html += '<h4 style="font-size: 0.75rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; display: flex; align-items: center; gap: 0.5rem;">';
  html += '<svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
  html += 'Select Time Slot</h4>';
  html += '<div id="time-slots-' + sanitizedId + '" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">' + generateTimeSlots() + '</div>';
  html += '<input type="hidden" name="selected_time" id="selected-time-' + sanitizedId + '" required />';
  html += '</div>';

  // Booking Summary
  html += '<div id="booking-summary-' + sanitizedId + '" style="background: #eff6ff; border-radius: 0.5rem; padding: 1rem; display: none;">';
  html += '<h4 style="font-size: 0.875rem; font-weight: 600; color: #1e3a8a; margin: 0 0 0.5rem 0;">Booking Summary</h4>';
  html += '<div style="font-size: 0.875rem; color: #1d4ed8;" id="summary-content-' + sanitizedId + '"></div>';
  html += '</div>';

  // Security Badge
  html += '<div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #6b7280; font-size: 0.875rem;">';
  html += '<svg style="width: 1.25rem; height: 1.25rem; color: #22c55e;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>';
  html += '<span>Your information is secured & encrypted</span>';
  html += '</div>';

  // Submit Button
  const buttonText = requirePayment && servicePrice > 0 ? submitButtonText + ' - ' + formatPrice(servicePrice) : submitButtonText;
  html += '<button type="submit" style="width: 100%; padding: 1rem; border-radius: 0.5rem; font-weight: 600; color: white; font-size: 1.125rem; border: none; cursor: pointer; background-color: ' + submitButtonColor + '; transition: transform 0.2s;">' + buttonText + '</button>';

  // Google Sheets Badge
  if (google_sheets_enabled) {
    html += '<div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.875rem; color: #16a34a; background: #f0fdf4; border-radius: 0.5rem; padding: 0.5rem 1rem; border: 1px solid #bbf7d0;">';
    html += '<svg style="width: 1.25rem; height: 1.25rem;" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>';
    html += '<span style="font-weight: 500;">Connected to Google Sheets</span>';
    html += '</div>';
  }

  // Footer Links
  html += '<div style="display: flex; align-items: center; justify-content: center; gap: 1rem; font-size: 0.875rem;">';
  html += '<a href="' + termsUrl + '" style="color: #2563eb; text-decoration: none;">Terms & Conditions</a>';
  html += '<span style="color: #d1d5db;">|</span>';
  html += '<a href="' + policyUrl + '" style="color: #2563eb; text-decoration: none;">Privacy Policy</a>';
  html += '</div>';

  html += '</div></form></div>';

  // JavaScript for calendar and form handling
  html += '<script>';
  html += '(function() {';
  html += 'var sanitizedId = "' + sanitizedId + '";';
  html += 'var availableDays = ' + JSON.stringify(availableDays) + ';';
  html += 'var blockedDates = ' + JSON.stringify(blockedDates) + ';';
  html += 'var serviceName = "' + serviceName.replace(/"/g, '\\"') + '";';
  html += 'var servicePrice = ' + servicePrice + ';';
  html += 'var currency = "' + currency + '";';
  html += 'var googleSheetsEnabled = ' + google_sheets_enabled + ';';
  html += 'var googleSheetsUrl = "' + (google_sheets_url || '').replace(/"/g, '\\"') + '";';
  html += 'var currentMonth = new Date();';
  html += 'var selectedDate = null;';
  html += 'var selectedTime = null;';
  html += 'var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];';
  html += 'var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];';

  html += 'function formatCurrency(value) {';
  html += '  if (currency === "MYR") return "RM " + value.toFixed(2);';
  html += '  return currency + " " + value.toFixed(2);';
  html += '}';

  html += 'function isDateAvailable(date) {';
  html += '  var today = new Date(); today.setHours(0, 0, 0, 0);';
  html += '  if (date < today) return false;';
  html += '  if (availableDays.indexOf(date.getDay()) === -1) return false;';
  html += '  var dateStr = date.toISOString().split("T")[0];';
  html += '  if (blockedDates.indexOf(dateStr) !== -1) return false;';
  html += '  return true;';
  html += '}';

  html += 'function renderCalendar() {';
  html += '  var calendar = document.getElementById("calendar-" + sanitizedId);';
  html += '  var year = currentMonth.getFullYear();';
  html += '  var month = currentMonth.getMonth();';
  html += '  var firstDay = new Date(year, month, 1);';
  html += '  var lastDay = new Date(year, month + 1, 0);';
  html += '  var h = "<div style=\\"display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;\\">";';
  html += '  h += "<button type=\\"button\\" onclick=\\"window.bookingCal_' + sanitizedId + '.prev()\\" style=\\"padding: 0.5rem; background: none; border: none; cursor: pointer;\\">&lt;</button>";';
  html += '  h += "<span style=\\"font-weight: 600;\\">" + monthNames[month] + " " + year + "</span>";';
  html += '  h += "<button type=\\"button\\" onclick=\\"window.bookingCal_' + sanitizedId + '.next()\\" style=\\"padding: 0.5rem; background: none; border: none; cursor: pointer;\\">&gt;</button>";';
  html += '  h += "</div>";';
  html += '  h += "<div style=\\"display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem; margin-bottom: 0.5rem;\\">";';
  html += '  for (var i = 0; i < dayNames.length; i++) { h += "<div style=\\"text-align: center; font-size: 0.75rem; color: #6b7280; padding: 0.5rem;\\">" + dayNames[i] + "</div>"; }';
  html += '  h += "</div>";';
  html += '  h += "<div style=\\"display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem;\\">";';
  html += '  for (var i = 0; i < firstDay.getDay(); i++) { h += "<div></div>"; }';
  html += '  for (var d = 1; d <= lastDay.getDate(); d++) {';
  html += '    var date = new Date(year, month, d);';
  html += '    var available = isDateAvailable(date);';
  html += '    var isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();';
  html += '    var dateStr = date.toISOString().split("T")[0];';
  html += '    var style = "padding: 0.5rem; text-align: center; border-radius: 0.5rem; cursor: " + (available ? "pointer" : "not-allowed") + "; font-size: 0.875rem; border: none; ";';
  html += '    if (isSelected) { style += "background: #3b82f6; color: white; font-weight: 600;"; }';
  html += '    else if (available) { style += "background: none; color: #111827;"; }';
  html += '    else { style += "background: none; color: #d1d5db;"; }';
  html += '    if (available) { h += "<button type=\\"button\\" style=\\"" + style + "\\" onclick=\\"window.bookingCal_' + sanitizedId + '.sel(&#39;" + dateStr + "&#39;)\\">" + d + "</button>"; }';
  html += '    else { h += "<div style=\\"" + style + "\\">" + d + "</div>"; }';
  html += '  }';
  html += '  h += "</div>";';
  html += '  calendar.innerHTML = h;';
  html += '}';

  html += 'function selectDate(dateStr) {';
  html += '  selectedDate = new Date(dateStr + "T00:00:00");';
  html += '  document.getElementById("selected-date-" + sanitizedId).value = dateStr;';
  html += '  renderCalendar();';
  html += '  updateSummary();';
  html += '}';

  html += 'function updateSummary() {';
  html += '  var summary = document.getElementById("booking-summary-" + sanitizedId);';
  html += '  var content = document.getElementById("summary-content-" + sanitizedId);';
  html += '  if (selectedDate || selectedTime) {';
  html += '    summary.style.display = "block";';
  html += '    var h = "";';
  html += '    if (selectedDate) { h += "<p style=\\"margin: 0 0 0.25rem 0;\\">Date: " + selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) + "</p>"; }';
  html += '    if (selectedTime) { h += "<p style=\\"margin: 0 0 0.25rem 0;\\">Time: " + selectedTime + "</p>"; }';
  html += '    h += "<p style=\\"margin: 0 0 0.25rem 0;\\">Service: " + serviceName + "</p>";';
  html += '    if (servicePrice > 0) { h += "<p style=\\"margin: 0; font-weight: 600;\\">Total: " + formatCurrency(servicePrice) + "</p>"; }';
  html += '    content.innerHTML = h;';
  html += '  } else { summary.style.display = "none"; }';
  html += '}';

  html += 'document.getElementById("time-slots-" + sanitizedId).addEventListener("click", function(e) {';
  html += '  if (e.target.classList.contains("time-slot")) {';
  html += '    var slots = document.querySelectorAll("#time-slots-" + sanitizedId + " .time-slot");';
  html += '    for (var i = 0; i < slots.length; i++) { slots[i].style.background = "white"; slots[i].style.color = "#374151"; slots[i].style.borderColor = "#d1d5db"; }';
  html += '    e.target.style.background = "#3b82f6"; e.target.style.color = "white"; e.target.style.borderColor = "#3b82f6";';
  html += '    selectedTime = e.target.dataset.time;';
  html += '    document.getElementById("selected-time-" + sanitizedId).value = selectedTime;';
  html += '    updateSummary();';
  html += '  }';
  html += '});';

  html += 'document.getElementById("booking-form-" + sanitizedId).addEventListener("submit", function(e) {';
  html += '  e.preventDefault();';
  html += '  if (!selectedDate || !selectedTime) { alert("Please select a date and time slot"); return; }';
  html += '  var formData = new FormData(this);';
  html += '  var data = {';
  html += '    name: formData.get("name") || "",';
  html += '    email: formData.get("email") || "",';
  html += '    phone: (formData.get("country_code") || "") + " " + (formData.get("phone") || ""),';
  html += '    remark: formData.get("remark") || "",';
  html += '    date: selectedDate.toISOString().split("T")[0],';
  html += '    time: selectedTime,';
  html += '    service: serviceName,';
  html += '    price: servicePrice,';
  html += '    currency: currency,';
  html += '    project_id: window.__PROJECT_ID__,';
  html += '    element_id: "' + element.id + '",';
  html += '    google_sheets_enabled: googleSheetsEnabled,';
  html += '    google_sheets_url: googleSheetsUrl';
  html += '  };';
  html += '  fetch("/api/bookings/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })';
  html += '  .then(function(r) { return r.json(); })';
  html += '  .then(function(result) {';
  html += '    if (result.success) {';
  html += '      alert("Booking confirmed! We will contact you shortly.");';
  html += '      document.getElementById("booking-form-" + sanitizedId).reset();';
  html += '      selectedDate = null; selectedTime = null;';
  html += '      document.getElementById("selected-date-" + sanitizedId).value = "";';
  html += '      document.getElementById("selected-time-" + sanitizedId).value = "";';
  html += '      var slots = document.querySelectorAll("#time-slots-" + sanitizedId + " .time-slot");';
  html += '      for (var i = 0; i < slots.length; i++) { slots[i].style.background = "white"; slots[i].style.color = "#374151"; slots[i].style.borderColor = "#d1d5db"; }';
  html += '      renderCalendar(); updateSummary();';
  html += '    } else { alert("Error: " + (result.error || "Failed to submit booking")); }';
  html += '  })';
  html += '  .catch(function(err) { console.error("Booking error:", err); alert("Failed to submit booking. Please try again."); });';
  html += '});';

  html += 'window.bookingCal_' + sanitizedId + ' = {';
  html += '  sel: selectDate,';
  html += '  prev: function() { currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1); renderCalendar(); },';
  html += '  next: function() { currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1); renderCalendar(); }';
  html += '};';

  html += 'renderCalendar();';
  html += '})();';
  html += '</script>';

  // Responsive styles
  html += '<style>';
  html += '@media (max-width: 640px) {';
  html += '  #time-slots-' + sanitizedId + ' { grid-template-columns: repeat(3, 1fr) !important; }';
  html += '}';
  html += '</style>';

  html += '</section>';

  return html;
}
