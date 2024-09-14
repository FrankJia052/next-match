import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useFilterStore from "./useFilterStore"
import { useEffect, useState } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import { Selection } from "@nextui-org/react";

// 把所有Filter中逻辑相关的方法都复制到这里
export const useFilters = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    // for the bug fix
    const [clientLoaded, setClientLoaded] = useState(false);
    useEffect(() => {
        setClientLoaded(true)
    }, [])

    // 这里使用我们新的filter store
    // 如果store中的全要，就无需再声明一次了
    const { filters, setFilters } = useFilterStore();

    const { gender, ageRange, orderBy } = filters;

    // 这里写的太漂亮了
    useEffect(() => {
        const searchParams = new URLSearchParams();

        if (gender) searchParams.set('gender', gender.join(','));
        if (ageRange) searchParams.set('ageRange', ageRange.toString());
        if (orderBy) searchParams.set('orderBy', orderBy)

        router.replace(`${pathname}?${searchParams}`);
    }, [ageRange, gender, orderBy, pathname, router])

    const orderByList = [
        { label: 'Last active', value: 'updated' },
        { label: 'Newest members', value: 'created' }
    ]

    const genderList = [
        { value: 'male', icon: FaMale },
        { value: 'female', icon: FaFemale }
    ]

    const handleAgeSelect = (value: number[]) => {
        setFilters('ageRange', value);
    }

    const handleOrderSelect = (value: Selection) => {
        if (value instanceof Set) {
            setFilters('orderBy', value.values().next().value);
        }
    }

    const handleGenderSelect = (value: string) => {
        if(gender.includes(value)) setFilters('gender', gender.filter(g => g !== value));
        else setFilters('gender', [...gender, value]);
        
    }

    return {
        clientLoaded,
        orderByList,
        genderList,
        selectAge: handleAgeSelect,
        selectOrder: handleOrderSelect,
        selectGender: handleGenderSelect,
        filters
    }
}