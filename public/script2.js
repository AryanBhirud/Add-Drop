  
function getCookieValue(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(";");
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const cookieParts = cookie.split("=");
  
      if (cookieParts[0] === name) {
        console.log(decodeURIComponent(cookieParts[1]));
        return decodeURIComponent(cookieParts[1]);
      }
    }
  
    return null;
  }

const fetchData = async (url, tableId) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const table = document.getElementById(tableId);
      const tbody = table.querySelector('tbody');
      tbody.innerHTML = '';

      data.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

fetchData(`http://localhost:8080/getdroppedcourse/${getCookieValue('student_id')}`, 'coursesTable');
document.getElementById("email-display").textContent = `Hi ${getCookieValue('email')}`;

