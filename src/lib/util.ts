import { differenceInYears } from "date-fns";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ZodIssue } from "zod";

// 根据某人的生日来计算某人的年龄
export function calculateAge (dob: Date) {
    return differenceInYears(new Date(), dob);
}

export function handleFormServerErrors<TFieldValues extends FieldValues> (
    errorResponse: {error: string | ZodIssue[]},
    setError: UseFormSetError<TFieldValues>
) {
    if(Array.isArray(errorResponse.error)) {
        errorResponse.error.forEach((e: any) => {
            const fieldName = e.path.join('.') as Path<TFieldValues>;
            setError(fieldName, {message: e.message})
        })
    } else {
        setError('root.serverError', {message: errorResponse.error})
    }
}