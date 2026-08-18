import api from './api';

export const contactService = {
  sendMessage: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const response = await api.post('/v1/contact', data);
    return response.data;
  },
};