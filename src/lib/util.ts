import { differenceInYears } from "date-fns";

// 根据某人的生日来计算某人的年龄
export function calculateAge (dob: Date) {
    return differenceInYears(new Date(), dob);
}
