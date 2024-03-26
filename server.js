/********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Nate Joshua Student ID: njoshua2 Date: 3/24/2024
*
*  Online (Cyclic) Link: https://raspberry-python-tam.cyclic.app/ (Cyclic did not allow me to deploy)
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var exphbs = require("express-handlebars");
var app = express();

const collegedata = require('./modules/collegeData'); // imports the collegedata module
app.use(express.static('views'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        navLink: (url, options) => {
            return '<li' +((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +'><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: (lvalue, rvalue, options) => {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');

collegedata.initialize().then(() => { // initializes collegedata before starting the server
    app.use((req, res, next) => {
        let route = req.path.substring(1);
        app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
        next();
    })

    app.get('/', (req, res) => {
        res.render('home')
    })

    app.get('/about', (req, res) => {
        res.render('about');
    })

    app.get('/htmldemo', (req, res) => {
        res.render('htmlDemo');
    })

    app.get('/students/add', (req, res) => {
        res.render('addStudent');
    })

    app.post('/students/add', (req, res) => {
        collegedata.addStudent(req.body).then(() => {
            res.redirect('/students')
        }).catch(() => {
            res.render('students', {message: "an error has occured"})
        })
    })

    app.get('/students', (req, res) => {
        var course = req.query.course;

        if (course) {
            collegedata.getStudentsByCourse(course).then((data) => { // calls this function if there is a query
                res.render('students', {students: data});
            }).catch(() => {
                res.render('students', {message: "no results"});
            })
        } else {
            collegedata.getAllStudents().then((data) => { // otherwise calls this function
                res.render('students', {students: data});
            }).catch(() => {
                res.render('students', {message: "no results"});
            })
        }
    })

    app.get('/courses', (req, res) => {
        collegedata.getCourses().then((data) => {
            res.render('courses', {courses: data});
        }).catch(() => {
            res.render('courses', {message: "no results"});
        })
    })

    app.get('/student/:num', (req, res) => {
        var num = req.params.num;

        collegedata.getStudentByNum(num).then((data) => {
            res.render('student', {student: data});
        }).catch(() => {
            res.render('student', {message: "an error has occured"});
        })
    })

    app.post('/student/update', (req, res) => {
        collegedata.updateStudent(req.body).then(() => {
            res.redirect('/students');
        }).catch(() => {
            res.render('student', {message: "an error has occured"});
        })
    })

    app.get('/course/:num', (req, res) => {
        var num = req.params.num;

        collegedata.getCourseById(num).then((data) => {
            res.render('course', {course: data});
        }).catch(() => {
            res.render('course', {message: 'error'});
        })
    })

    app.use((req, res) => { // shows a 404 page if an invalid page is entered
        res.status(404).render('errorpage');
    })
}).then(() => {
    app.listen(HTTP_PORT, () => {console.log(`Server listening on port ${HTTP_PORT}`)}); // starts the server
}).catch((err) => {
    console.error(`Error importing data, server not started: ${err}`);
})