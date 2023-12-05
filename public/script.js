function getCookieValue(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const cookieParts = cookie.split('=');

        if (cookieParts[0] === name) {
            console.log(decodeURIComponent(cookieParts[1]));
            return decodeURIComponent(cookieParts[1]);

        }
    }

    return null;
}

async function dropCourse() {
    const selectedYear = document.getElementById('year-drop-down').value;
    const selectedCourse = document.getElementById('course-drop-down').value;
    const selectedFaculty = document.getElementById('faculty-drop-down').value;
    const selectedSlot = document.getElementById('slot-drop-down').value;

    try {
        student_id = getCookieValue('student_id');
        console.log(student_id);
        const checker = await checkDrop(selectedCourse, student_id);
        if (!checker) {
            const data = await postRequest(student_id, selectedYear, selectedCourse, selectedFaculty, selectedSlot);
            const courses = data.map(course => course.course_name);
            var list = document.getElementById('dropped-courses');
            list.innerHTML = ""
            courses.forEach((course) => {
                const li = document.createElement('li');
                li.textContent = course;
                li.setAttribute('value', course);
                list.appendChild(li);
            });
        } else {
            alert('You have already dropped this course.')
        }

    } catch (error) {
        console.error(error);
    }
}
async function checkDrop(selectedCourse, student_id) {


    try {
        const response = await fetch(`http://localhost:8080/mydrops/${student_id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        var course_dropped = false;

        data.map((course) => {
            if (course.course_name == selectedCourse) {
                course_dropped = true;
                return course_dropped;
            }
        });

        return course_dropped;
    } catch (error) {
        console.error('Error in checkDrop:', error);
        throw error;
    }
}

function postRequest(student_id, selectedYear, selectedCourse, selectedFaculty, selectedSlot) {
    const url = 'http://localhost:8080/drop';
    const data = {
        student_id: student_id,
        year: selectedYear,
        course_name: selectedCourse,
        faculty: selectedFaculty,
        slot: selectedSlot
    };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:8080/allcourses');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
        const years = data.map(course => course.year);
        const courses = data.map(course => course.course_name);
        const facultys = data.map(course => course.faculty);
        const slots = data.map(course => course.slot);
        var year_dropdown = document.getElementById('year-drop-down');
        var course_dropdown = document.getElementById('course-drop-down');
        var faculty_dropdown = document.getElementById('faculty-drop-down');
        var slot_dropdown = document.getElementById('slot-drop-down');
        var years1 = []
        const myId = getCookieValue('student_id')
        console.log(myId)
        const myresponse = await fetch(`http://localhost:8080/mydrops/${myId}`);
        const mydata = await myresponse.json();
        const mycourses = mydata.map(mycourse => mycourse.course_name);
        var list = document.getElementById('dropped-courses');
        list.innerHTML = ""
        mycourses.forEach((mycourse) => {
            const li = document.createElement('li');
            li.textContent = mycourse;
            li.setAttribute('value', mycourse);
            list.appendChild(li);
        });


        years.forEach(year => {
            if (!years1.includes(year)) {
                years1.push(year);
                var option = document.createElement('option');
                option.value = year;
                option.text = year;
                year_dropdown.appendChild(option);
            }

        })

        courses.forEach(course => {
            var option = document.createElement('option');
            option.value = course;
            option.text = course;
            course_dropdown.appendChild(option);
            console.log(course)
        });

        facultys.forEach(faculty => {
            var option = document.createElement('option');
            option.value = faculty;
            option.text = faculty;
            faculty_dropdown.appendChild(option);
            console.log(faculty)
        });
        const slot2 = []
        slots.forEach(slot => {
            if (!slot2.includes(slot)) {
                slot2.push(slot)
                var option = document.createElement('option');
                option.value = slot;
                option.text = slot;
                slot_dropdown.appendChild(option);
                console.log(slot)
            }

        })

        const userEmail = getCookieValue('email');
        const studentId = getCookieValue('student_id');
        document.getElementById('email-display').textContent = `Hi ${userEmail}`;



    } catch (error) {
        console.error('Error:', error);
    }
});
