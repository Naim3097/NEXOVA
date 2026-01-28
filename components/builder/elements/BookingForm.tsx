import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Shield,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface BookingFormElementProps {
  props: {
    title?: string;
    description?: string;
    // Form fields
    nameLabel?: string;
    phoneLabel?: string;
    emailLabel?: string;
    remarkLabel?: string;
    showName?: boolean;
    showPhone?: boolean;
    showEmail?: boolean;
    showRemark?: boolean;
    nameRequired?: boolean;
    phoneRequired?: boolean;
    emailRequired?: boolean;
    remarkRequired?: boolean;
    defaultCountryCode?: string;
    // Booking settings
    serviceName?: string;
    servicePrice?: number;
    currency?: string;
    duration?: number; // in minutes
    // Time slots configuration
    timeSlots?: TimeSlot[];
    slotDuration?: number; // in minutes
    startTime?: string; // e.g., "09:00"
    endTime?: string; // e.g., "18:00"
    // Available days (0 = Sunday, 1 = Monday, etc.)
    availableDays?: number[];
    // Blocked dates (ISO strings)
    blockedDates?: string[];
    // UI customization
    submitButtonText?: string;
    submitButtonColor?: string;
    bgColor?: string;
    // Google Sheets integration
    google_sheets_enabled?: boolean;
    google_sheets_url?: string;
    // Google Calendar integration
    google_calendar_enabled?: boolean;
    // Payment settings
    requirePayment?: boolean;
    // Footer
    termsUrl?: string;
    policyUrl?: string;
  };
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

// Country codes for mobile number
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

// Generate time slots based on start/end time and duration
const generateDefaultTimeSlots = (
  startTime: string = '09:00',
  endTime: string = '18:00',
  duration: number = 60
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentHour = startHour;
  let currentMin = startMin;
  let id = 1;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
    slots.push({
      id: `slot-${id++}`,
      time: timeStr,
      available: true,
    });

    currentMin += duration;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }

  return slots;
};

export const BookingFormElement = React.memo(
  ({
    props,
    isSelected,
    isHovered,
    onSelect,
    onHover,
  }: BookingFormElementProps) => {
    const {
      title = 'Book an Appointment',
      description = 'Select your preferred date and time slot',
      nameLabel = 'Full Name',
      phoneLabel = 'Phone Number',
      emailLabel = 'Email',
      remarkLabel = 'Notes / Remarks',
      showName = true,
      showPhone = true,
      showEmail = true,
      showRemark = true,
      nameRequired = true,
      phoneRequired = true,
      emailRequired = true,
      remarkRequired = false,
      defaultCountryCode = 'MY',
      serviceName = 'Consultation',
      servicePrice = 0,
      currency = 'MYR',
      duration = 60,
      timeSlots,
      slotDuration = 60,
      startTime = '09:00',
      endTime = '18:00',
      availableDays = [1, 2, 3, 4, 5], // Monday to Friday
      blockedDates = [],
      submitButtonText = 'Confirm Booking',
      submitButtonColor = '#2563eb',
      bgColor = '#ffffff',
      google_sheets_enabled = false,
      google_calendar_enabled = false,
      requirePayment = false,
      termsUrl = '#',
      policyUrl = '#',
    } = props;

    // Preview state
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const selectedCountry =
      countryCodes.find((c) => c.code === defaultCountryCode) ||
      countryCodes[0];

    // Generate time slots if not provided
    const displayTimeSlots =
      timeSlots || generateDefaultTimeSlots(startTime, endTime, slotDuration);

    const baseClasses = `relative transition-all ${
      isSelected ? 'ring-4 ring-blue-500' : ''
    } ${isHovered ? 'ring-2 ring-blue-300' : ''}`;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.();
    };

    const handleMouseEnter = () => onHover?.(true);
    const handleMouseLeave = () => onHover?.(false);

    // Format currency
    const formatCurrency = (value: number) => {
      if (currency === 'MYR') {
        return `RM ${value.toFixed(2)}`;
      }
      return `${currency} ${value.toFixed(2)}`;
    };

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const days: (Date | null)[] = [];

      // Add empty slots for days before the first day of the month
      for (let i = 0; i < firstDay.getDay(); i++) {
        days.push(null);
      }

      // Add all days of the month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
      }

      return days;
    };

    const isDateAvailable = (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if date is in the past
      if (date < today) return false;

      // Check if day of week is available
      if (!availableDays.includes(date.getDay())) return false;

      // Check if date is blocked
      const dateStr = date.toISOString().split('T')[0];
      if (blockedDates.includes(dateStr)) return false;

      return true;
    };

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const goToPrevMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
      );
    };

    const goToNextMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
      );
    };

    const handleDateSelect = (date: Date | null, e: React.MouseEvent) => {
      e.stopPropagation();
      if (date && isDateAvailable(date)) {
        setSelectedDate(date);
        setSelectedSlot(null);
      }
    };

    const handleSlotSelect = (slotId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedSlot(slotId);
    };

    const days = getDaysInMonth(currentMonth);

    return (
      <section
        className={`${baseClasses} py-8 px-4 cursor-pointer`}
        style={{ backgroundColor: bgColor }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          {(title || description) && (
            <div className="text-center mb-8">
              {title && (
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {title}
                </h2>
              )}
              {description && <p className="text-gray-600">{description}</p>}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Service Info */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{serviceName}</h3>
                  <p className="text-blue-100 flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4" />
                    {duration} minutes
                  </p>
                </div>
                {servicePrice > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-blue-100">Price</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(servicePrice)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info Fields */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Your Information
                </h4>

                {/* Name Field */}
                {showName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {nameLabel}
                        {nameRequired && (
                          <span className="text-red-500">*</span>
                        )}
                      </div>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      disabled
                    />
                  </div>
                )}

                {/* Phone Number Field */}
                {showPhone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {phoneLabel}
                        {phoneRequired && (
                          <span className="text-red-500">*</span>
                        )}
                      </div>
                    </label>
                    <div className="flex">
                      <div className="flex items-center gap-2 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="text-gray-600 text-sm">&#9660;</span>
                      </div>
                      <input
                        type="tel"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="012-345 6789"
                        disabled
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                {showEmail && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {emailLabel}
                        {emailRequired && (
                          <span className="text-red-500">*</span>
                        )}
                      </div>
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                      disabled
                    />
                  </div>
                )}

                {/* Remark/Notes Field */}
                {showRemark && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {remarkLabel}
                        {remarkRequired && (
                          <span className="text-red-500">*</span>
                        )}
                      </div>
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Any special requests or notes..."
                      rows={3}
                      disabled
                    />
                  </div>
                )}
              </div>

              {/* Calendar Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Select Date
                </h4>

                <div className="border border-gray-200 rounded-lg p-4">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={goToPrevMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h5 className="text-lg font-semibold text-gray-900">
                      {monthNames[currentMonth.getMonth()]}{' '}
                      {currentMonth.getFullYear()}
                    </h5>
                    <button
                      type="button"
                      onClick={goToNextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium text-gray-500 py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((date, index) => {
                      if (!date) {
                        return <div key={`empty-${index}`} className="p-2" />;
                      }

                      const isAvailable = isDateAvailable(date);
                      const isSelected =
                        selectedDate?.toDateString() === date.toDateString();

                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={(e) => handleDateSelect(date, e)}
                          disabled={!isAvailable}
                          className={`p-2 text-sm rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-blue-500 text-white font-semibold'
                              : isAvailable
                                ? 'hover:bg-blue-50 text-gray-900'
                                : 'text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Select Time Slot
                </h4>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {displayTimeSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={(e) => handleSlotSelect(slot.id, e)}
                        disabled={!slot.available}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          isSelected
                            ? 'bg-blue-500 text-white border-blue-500'
                            : slot.available
                              ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700'
                              : 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              {(selectedDate || selectedSlot) && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    Booking Summary
                  </h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    {selectedDate && (
                      <p>
                        Date:{' '}
                        {selectedDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                    {selectedSlot && (
                      <p>
                        Time:{' '}
                        {
                          displayTimeSlots.find((s) => s.id === selectedSlot)
                            ?.time
                        }
                      </p>
                    )}
                    <p>Service: {serviceName}</p>
                    {servicePrice > 0 && (
                      <p className="font-semibold">
                        Total: {formatCurrency(servicePrice)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Your information is secured & encrypted</span>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="w-full py-4 rounded-lg font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] text-lg"
                style={{ backgroundColor: submitButtonColor }}
                onClick={(e) => e.stopPropagation()}
                disabled
              >
                {requirePayment && servicePrice > 0
                  ? `${submitButtonText} - ${formatCurrency(servicePrice)}`
                  : submitButtonText}
              </button>

              {/* Google Sheets Badge */}
              {google_sheets_enabled && (
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg py-2 px-4 border border-green-200">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                  <span className="font-medium">
                    Connected to Google Sheets
                  </span>
                </div>
              )}

              {/* Google Calendar Badge */}
              {google_calendar_enabled && (
                <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-lg py-2 px-4 border border-blue-200">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Synced to Google Calendar</span>
                </div>
              )}

              {/* Footer Links */}
              <div className="flex items-center justify-center gap-4 text-sm">
                <a
                  href={termsUrl}
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms & Conditions
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href={policyUrl}
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

BookingFormElement.displayName = 'BookingFormElement';
