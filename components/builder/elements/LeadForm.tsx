import React from 'react';
import { Mail, User, Phone, MessageSquare } from 'lucide-react';

interface LeadFormElementProps {
  props: {
    title?: string;
    description?: string;
    nameLabel?: string;
    emailLabel?: string;
    phoneLabel?: string;
    messageLabel?: string;
    submitButtonText?: string;
    submitButtonColor?: string;
    successMessage?: string;
    fields?: {
      showPhone?: boolean;
      showMessage?: boolean;
      phoneRequired?: boolean;
      messageRequired?: boolean;
    };
    bgColor?: string;
    google_sheets_enabled?: boolean;
    google_sheets_url?: string;
  };
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

export const LeadFormElement = React.memo(
  ({ props, isSelected, isHovered, onSelect, onHover }: LeadFormElementProps) => {
    const {
      title = 'Get In Touch',
      description = "Fill out the form below and we'll get back to you soon.",
      nameLabel = 'Your Name',
      emailLabel = 'Email Address',
      phoneLabel = 'Phone Number (optional)',
      messageLabel = 'Message (optional)',
      submitButtonText = 'Submit',
      submitButtonColor = '#2563eb',
      fields = {
        showPhone: true,
        showMessage: true,
        phoneRequired: false,
        messageRequired: false,
      },
      bgColor = '#ffffff',
      google_sheets_enabled = false,
    } = props;

    const baseClasses = `relative transition-all ${
      isSelected ? 'ring-4 ring-blue-500' : ''
    } ${isHovered ? 'ring-2 ring-blue-300' : ''}`;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.();
    };

    const handleMouseEnter = () => onHover?.(true);
    const handleMouseLeave = () => onHover?.(false);

    return (
      <section
        className={`${baseClasses} py-16 px-4 cursor-pointer`}
        style={{ backgroundColor: bgColor }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
              {description && (
                <p className="text-gray-600">{description}</p>
              )}
            </div>

            {/* Form Preview */}
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {nameLabel} <span className="text-red-600">*</span>
                  </div>
                </label>
                <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  John Doe
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {emailLabel} <span className="text-red-600">*</span>
                  </div>
                </label>
                <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  john@example.com
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll never share your email with anyone else.
                </p>
              </div>

              {/* Phone Field (conditional) */}
              {fields.showPhone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {phoneLabel}
                      {fields.phoneRequired && <span className="text-red-600">*</span>}
                    </div>
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    +60123456789
                  </div>
                </div>
              )}

              {/* Message Field (conditional) */}
              {fields.showMessage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {messageLabel}
                      {fields.messageRequired && <span className="text-red-600">*</span>}
                    </div>
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-500 h-24">
                    Tell us more about your inquiry...
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                className="w-full py-3.5 rounded-lg font-semibold text-white shadow-md transition-transform hover:scale-105"
                style={{ backgroundColor: submitButtonColor }}
                onClick={(e) => e.stopPropagation()}
              >
                {submitButtonText}
              </button>

              {/* Google Sheets Badge */}
              {google_sheets_enabled && (
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg py-2 px-4 border border-green-200">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                  <span className="font-medium">Connected to Google Sheets</span>
                </div>
              )}

              {/* Privacy Note */}
              <p className="text-center text-xs text-gray-500 mt-6">
                🔒 Your information is secure and will never be shared.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

LeadFormElement.displayName = 'LeadFormElement';
