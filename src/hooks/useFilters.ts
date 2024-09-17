import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useFilterStore from "./useFilterStore"
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import { Selection } from "@nextui-org/react";
import usePaginationStore from "./usePaginationStore";

export const useFilters = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // for the bug fix
    const [clientLoaded, setClientLoaded] = useState(false);
    useEffect(() => {
        setClientLoaded(true)
    }, [])

    const { filters, setFilters } = useFilterStore();

    const {pageNumber, pageSize, setPage} = usePaginationStore(state => ({
        pageNumber: state.pagination.pageNumber,
        pageSize: state.pagination.pageSize,
        setPage: state.setPage
    }))

    // 添加withPhoto
    const { gender, ageRange, orderBy, withPhoto } = filters;

    useEffect(() => {
        // 当withPhoto变化的时候，一样初始化分页
        if(gender || ageRange || orderBy || withPhoto) {
            setPage(1);
        }
    }, [ageRange, gender, orderBy, setPage, withPhoto])

    useEffect(() => {
        startTransition(() => {
            const searchParams = new URLSearchParams();

            if (gender) searchParams.set('gender', gender.join(','));
            if (ageRange) searchParams.set('ageRange', ageRange.toString());
            if (orderBy) searchParams.set('orderBy', orderBy);
            if (pageSize) searchParams.set('pageSize', pageSize.toString());
            if (pageNumber) searchParams.set('pageNumber', pageNumber.toString());
            // 重点: 不要用if，否则withPhoto会有可能不存在，我们需要它一直存在
            searchParams.set('withPhoto', withPhoto.toString());
    
            router.replace(`${pathname}?${searchParams}`);
        })

    }, [ageRange, gender, orderBy, pathname, router, pageSize, pageNumber, withPhoto])

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

    // 重点: 切换withImage的逻辑，这个event是onchange的事件，注意 e 的type
    const handleWithPhotoToggle = (e:ChangeEvent<HTMLInputElement>) => {
        setFilters('withPhoto', e.target.checked);
    }

    return {
        clientLoaded,
        orderByList,
        genderList,
        selectAge: handleAgeSelect,
        selectOrder: handleOrderSelect,
        selectGender: handleGenderSelect,
        filters,
        isPending,
        selectWithPhoto:handleWithPhotoToggle
    }
}