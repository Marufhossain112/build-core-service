const getAvailableCourses = async (
    offeredCourses: any,
    studentCurrentSemesterTakenCourse: any,
    studentCompletedCourse: any
) => {
    // console.log("Available courses", studentCompletedCourse);
    const completedCourseId = studentCompletedCourse.map((course: any) => course.courseId);
    // console.log("completedCourseId", completedCourseId);
    const availableCourseList = offeredCourses.filter((offeredCourse: any) => !completedCourseId.includes(offeredCourse.courseId)
    ).filter((offeredCourse: any) => completedCourseId.includes(offeredCourse.courseId)
    ).filter((course: any) => {
        const preRequisites = course.course.prerequisite;
        if (preRequisites.length === 0) {
            return true;
        } else {
            const preRequisitesIds = preRequisites.map((preRequisite: any) => preRequisite.prerequisiteId);
            return preRequisitesIds.every((id: string) => completedCourseId.includes(id));
            // console.log("Pre", res);
        }
    }).map((course: any) => {
        const isAlreadyTakenCourse = studentCurrentSemesterTakenCourse.find((c: any) =>
            c.offeredCourseId === course.id
        );
        // console.log("isAlreadyTakenCourse", isAlreadyTakenCourse);
        if (isAlreadyTakenCourse) {
            course.offeredCourseSections.map((section: any) => {
                if (section.id === isAlreadyTakenCourse.offeredCourseId) {
                    section.isTaken = true;
                } else {
                    section.isTaken = false;
                }
            });
            return {
                ...course,
                isTaken: true
            };
        }
        else {
            course.offeredCourseSections.map((section: any) => {
                section.isTaken = false;
            });
            return {
                ...course,
                isTaken: true
            };
        }
    });
    // console.log("availableCourseList", availableCourseList);
    // console.log("availableCourseList", availableCourseList);
    // console.log("existCourseList", existCourseList);
    return availableCourseList;
};
export const SemesterRegistrationUtils = {
    getAvailableCourses
};