const fs = require("fs");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
};

var dataCollection = null;

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};

module.exports.getAllStudents = () => {
    return new Promise((resolve,reject) => {
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
};

module.exports.getCourses = () => {
   return new Promise((resolve,reject) => {
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getCourseById = (num) => {
    return new Promise((resolve, reject) => {
        var foundCourse = null;

        for (let i = 0; i < dataCollection.courses.length; i++) {
            if (dataCollection.courses[i].courseId == num) {
                foundCourse = dataCollection.courses[i];
            }
        }

        if (!foundCourse) {
            reject("query returned 0 results"); return;
        }

        resolve(foundCourse);
    })
};

module.exports.getStudentByNum = (num) => {
    return new Promise((resolve, reject) => {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = (course) => {
    return new Promise((resolve, reject) => {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        if (typeof studentData.TA === undefined) {
            studentData.TA = false;
        } else {
            studentData.TA = true;
        }
        studentData.course = Number(studentData.course);
        studentData.studentNum = (dataCollection.students.length + 1);
        dataCollection.students.push(studentData);
        resolve();
    })
};

module.exports.updateStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == studentData.studentNum) {
                dataCollection.students[i].firstName = studentData.firstName;
                dataCollection.students[i].lastName = studentData.lastName;
                dataCollection.students[i].email = studentData.email;
                dataCollection.students[i].addressStreet = studentData.addressStreet;
                dataCollection.students[i].addressCity = studentData.addressCity;
                dataCollection.students[i].addressProvince = studentData.addressProvince;
                dataCollection.students[i].TA = studentData.TA;
                dataCollection.students[i].status = studentData.status;
                dataCollection.students[i].course = studentData.course;
            }
        }
        resolve();
    })
};