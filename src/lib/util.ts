import { differenceInYears, format } from "date-fns";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ZodIssue } from "zod";

// 根据某人的生日来计算某人的年龄
export function calculateAge (dob: Date) {
    return differenceInYears(new Date(), dob);
}

// 整理时间格式
export function formatShortDateTime(date: Date) {
    return format(date, 'dd MMM yy h:mm a')
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

// 把cloudinary的url改成智能调节过的，找人脸那种
export function transformImageUrl(imageUrl?: string | null) {
    if(!imageUrl) return null;

    if(!imageUrl.includes('cloudinary')) return imageUrl;

    const uploadIndex = imageUrl.indexOf('/upload/') + '/upload/'.length
    // 注意不要少了最后的符号/
    const transformation = 'c_fill,w_300,h_300,g_faces/';

    return `${imageUrl.slice(0, uploadIndex)}${transformation}${imageUrl.slice(uploadIndex)}`
}

// 把长文字变短并且添加省略号
export function truncateString(text?: string | null, num = 50) {
    if (!text) return null;
    if(text.length <= num) {
        return text;
    }
    return text.slice(0,num) + '...'
} 