const cors = require('cors');
const express = require('express')
const path = require('path');
const { dirname } = require('path');
const bodyParser = require('body-parser');
const url = require('url');
const db = require('./db.js');
const { validateToken } = require('./jwt.js');
const cookieParser = require('cookie-parser');
const dropCourse = db.dropCourse;
const addCourse = db.addCourse;
const getCourses = db.getCourses;
const getEmail = db.getEmail;
const myDrops = db.myDrops;
const myAdds = db.myAdds;
const deleteDrop = db.deleteDroppedCourse_db;
const deleteAdd = db.deleteAddedCourse_db;
const getDroppedCourse = db.getDroppedCourse;

const app = express()
app.use(cookieParser());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

app.use(express.static(path.join(__dirname, './public')));
app.get('/allcourses', async (req, res) => {
    const courses = await getCourses()
    res.send(courses)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something Broke!')
})

app.get('/mydrops/:student_id', async (req, res) => {
    const student_id = req.params.student_id;
    const [dropped_courses] = await myDrops(student_id);
    res.send(dropped_courses);
})

app.get('/myadds/:student_id', async (req, res) => {
    const student_id = req.params.student_id;
    const [added_courses] = await myAdds(student_id);
    res.send(added_courses);
})

app.post('/drop', async (req, res) => {
    const { student_id, year, course_name, faculty, slot } = req.body
    const dropped_courses = await dropCourse(student_id, year, course_name, faculty, slot)
    res.status(201).send(dropped_courses[0])
})

app.post('/add', async(req, res) => {
    const { student_id, year, course_name, faculty, slot } = req.body
    const added_courses = await addCourse(student_id, year, course_name, faculty, slot)
    res.status(201).send(added_courses[0])
})

app.post('/deletedrop', async (req, res) => {
    const { student_id, course_name } = req.body;
    const deletedrop = await deleteDrop(student_id, course_name);
    if(deletedrop == 1) {
        res.status(200).send(`${course_name} was deleted from your drop list.`);
    } else {
        res.status(500);
    }
})

app.post('/deleteadd', async (req, res) => {
    const { student_id, course_name } = req.body;
    const deleteadd = await deleteAdd(student_id, course_name);
    if(deleteadd == 1) {
        res.status(200).send(`${course_name} was deleted from your add list.`);
    } else {
        res.status(500);
    }
})

app.get('/getdroppedcourse/:student_id', async (req, res) => {
    const student_id = req.params.student_id;
    const all_drops = await getDroppedCourse(student_id);
    res.send(all_drops);
})

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})



// logout ka button
// populate right content
// drop courses student id manage
// delete drop courses
// forgot password
// add courses dashboard
// filtering courses
// one-to-one mapping 
// triple chaining