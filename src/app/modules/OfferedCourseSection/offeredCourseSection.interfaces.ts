import { WeekDays } from "@prisma/client";
export type IOfferedCourseSchedule = {
    startTime: string;
    endTime: string;
    daysOfWeek: WeekDays;
    roomId: string;
    facultyId: string;
};
export type IOfferedCourseSection = {
    title: string;
    maxCapacity: number;
    offeredCourseId: string;
    classSchedules: IOfferedCourseSchedule[];
};











