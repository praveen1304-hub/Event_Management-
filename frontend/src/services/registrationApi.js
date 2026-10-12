import { apiRequest } from './api';
import { initialRegistrations } from '../data/mockRegistrations';

export const registrationApi = {
  // Student Register for Event (NO LOGIN REQUIRED)
  async registerForEvent({ eventId, studentName, rollNumber, department, year, email }) {
    const cleanId = String(eventId).replace('evt-', '');
    const payload = {
      student_name: studentName.trim(),
      roll_number: rollNumber.trim().toUpperCase(),
      department: department.trim(),
      year: year.trim(),
      email: email.trim().toLowerCase()
    };

    return await apiRequest(`/events/${cleanId}/register`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Get Registration / Entry Pass by ID
  async getRegistrationById(registrationId) {
    const cleanId = String(registrationId).replace('reg-', '');
    try {
      const response = await apiRequest(`/registrations/${cleanId}`);
      return response;
    } catch (e) {
      const found = initialRegistrations.find(
        r => String(r.id) === cleanId || r.registrationId === registrationId || r.eventCode === registrationId
      );
      if (found) return found;
      throw e;
    }
  },

  // Resend Verification Email with QR Code and Entry Code
  async resendEmail(registrationId) {
    const cleanId = String(registrationId).replace('reg-', '');
    return await apiRequest(`/registrations/${cleanId}/resend-email`, {
      method: 'POST'
    });
  },

  // Get All Registrations for a Specific Event (Host view)
  async getEventRegistrations(eventId) {
    const cleanId = String(eventId).replace('evt-', '');
    try {
      const response = await apiRequest(`/host/events/${cleanId}/registrations`);
      return response;
    } catch (e) {
      return initialRegistrations.filter(r => String(r.eventId) === String(eventId) || String(r.event_id) === cleanId);
    }
  },

  // Mark Attendance / Verify Entry QR
  async verifyAndMarkAttendance({ eventId, codeOrId }) {
    const cleanId = String(eventId).replace('evt-', '');
    try {
      const response = await apiRequest(`/host/events/${cleanId}/attendance`, {
        method: 'POST',
        body: JSON.stringify({ registration_code: codeOrId })
      });

      return {
        valid: true,
        status: 'VERIFIED',
        message: 'Entry Verified & Attendance Successfully Marked!',
        registration: response.registration || response
      };
    } catch (err) {
      const msg = err.message || '';
      let status = 'INVALID';
      if (msg.toLowerCase().includes('already')) {
        status = 'ALREADY_MARKED';
      } else if (msg.toLowerCase().includes('wrong event')) {
        status = 'WRONG_EVENT';
      }

      return {
        valid: false,
        status,
        message: msg,
        registration: err.data?.errors?.registration || null
      };
    }
  },

  // Toggle Attendance Status directly from table
  async toggleAttendanceStatus(registrationId) {
    const cleanId = String(registrationId).replace('reg-', '');
    return await apiRequest(`/host/registrations/${cleanId}/toggle-attendance`, {
      method: 'PATCH'
    });
  }
};
