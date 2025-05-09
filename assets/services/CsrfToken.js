import axios from 'axios';

export const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/api/csrf-token');
      const csrfToken = response.data.token;
      return csrfToken;
      
    } catch (error) {
      console.error('Error fetching CSRF token', error);
    }
  };
  
  