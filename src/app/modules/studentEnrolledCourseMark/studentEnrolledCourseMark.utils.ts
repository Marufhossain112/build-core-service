import { Course, StudentEnrolledCourse } from "@prisma/client";

const studentEnrolledCourseMarkGrade = (marks: number) => {
    let result = {
        grade: '',
        point: 0
    };
    if (marks >= 0 && marks <= 39) {
        result = {
            grade: "F",
            point: 0
        };
    }
    else if (marks >= 40 && marks <= 49) {
        result = {
            grade: "D",
            point: 2.00
        };
    }
    else if (marks >= 50 && marks <= 59) {
        result = {
            grade: "C",
            point: 2.50
        };
    }
    else if (marks >= 60 && marks <= 69) {
        result = {
            grade: "B",
            point: 3.00
        };
    }
    else if (marks >= 70 && marks <= 79) {
        result = {
            grade: "A",
            point: 3.50
        };
    }
    else if (marks >= 80 && marks <= 100) {
        result = {
            grade: "A+",
            point: 4.00
        };
    }
    return result;
};

const calculateCGPAandGrade = async (payload: (StudentEnrolledCourse & { course: Course; })[]) => {
    // console.log("payload", payload);
    let result = {
        totalCompletedCredit: 0,
        cgpa: 0
    };
    if (payload.length === 0) {
        result = {
            totalCompletedCredit: 0,
            cgpa: 0
        };
    }
    let totalCGPA = 0;
    let totalCredits = 0;
    for (const grade of payload) {
        // console.log("grade part", grade);
        totalCGPA += grade.point || 0;
        totalCredits += grade.course.credits || 0;
        console.log("totalCGPA", totalCGPA);
        console.log("totalCredits", totalCredits);
        const avgCGPA = totalCGPA / payload.length;
        console.log("avgCGPA", avgCGPA);
    }
};
export const StudentEnrolledCourseMarkUtils = {
    studentEnrolledCourseMarkGrade,
    calculateCGPAandGrade
};