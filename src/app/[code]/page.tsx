'use client'

import {redirect, useParams} from 'next/navigation';

export default function RootCodePage() {
    const {code} = useParams();
    redirect(`/invite/${code}`);
}