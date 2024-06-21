import axios from 'axios';

get('http://localhost:8080/ping')
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
