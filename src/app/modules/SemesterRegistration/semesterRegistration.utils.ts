const getAvailableCourses = async (
    offeredCourses: any,
    studentCurrentSemesterTakenCourse: any,
    studentCompletedCourse: any
) => {
    // console.log("Available courses", studentCompletedCourse);
    const completedCourseId = studentCompletedCourse.map((course: any) => course.courseId);
    // console.log("completedCourseId", completedCourseId);
    const availableCourseList = offeredCourses.filter((offeredCourse: any) => !completedCourseId.includes(offeredCourse.courseId)
    ).filter((course: any) => {
        const preRequisites = course.course.prerequisite;
        // console.log("check_me", preRequisites);
        if (preRequisites.length === 0) {
            return true;
            // console.log("Pre com", `${Com}`);
        } else {
            const preRequisitesIds = preRequisites.map((preRequisite: any) => preRequisite.prerequisiteId);
            return preRequisitesIds.every((id: string) => completedCourseId.includes(id));
            // console.log("Pre", res);
            // console.log("Pre not com", `${notCom}`);
        }
    }).map((course: any) => {
        // return course;
        const isAlreadyTakenCourse = studentCurrentSemesterTakenCourse.find(
            (c: any) => c.offeredCourseId === course.id
        );
        if (isAlreadyTakenCourse) {
            course.OfferedCourseSection.map((section: any) => {
                if (section.id === isAlreadyTakenCourse.offeredCourseSectionId) {
                    section.isTaken = true;
                }
                else {
                    section.isTaken = false;
                }
            });
            return {
                ...course,
                isTaken: true
            };
            // console.log("kk", course.OfferedCourseSection);
        }
        else {
            course.OfferedCourseSection.map((section: any) => {
                section.isTaken = false;
            });
            return {
                ...course,
                isTaken: false
            };
        };
    });

    return availableCourseList;
};
export const SemesterRegistrationUtils = {
    getAvailableCourses
};