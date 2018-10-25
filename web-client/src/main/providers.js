import axios from 'axios';

export const api = {
  getDocumentPolicy: async baseUrl => {
    try {
      const response = await axios.get(`${baseUrl}/documents/policy`);
      return response.data;
    } catch (error) {
      return error;
    }
  },

  addDocument: async baseUrl => {
    try {
      const response = await axios.post(`${baseUrl}/document`, {});
      return response.data;
    } catch (error) {
      return error;
    }
  },

  uploadDocumentToS3: async (policy, file) => {
    try {
      let formData = new FormData();
      formData.append('key', 'lol!');
      formData.append('X-Amz-Algorithm', policy.fields['X-Amz-Algorithm']);
      formData.append('X-Amz-Credential', policy.fields['X-Amz-Credential']);
      formData.append('X-Amz-Date', policy.fields['X-Amz-Date']);
      formData.append(
        'X-Amz-Security-Token',
        policy.fields['X-Amz-Security-Token'],
      );
      formData.append('Policy', policy.fields.Policy);
      formData.append('X-Amz-Signature', policy.fields['X-Amz-Signature']);
      formData.append('file', file);
      await axios.post(policy.url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return;
    } catch (error) {
      return error;
    }
  },
};
