// app/user/voted/fetcher.ts (Yeni Dosya)

import { headers } from 'next/headers';
import { IBaseResponse } from '@/app/types/common';
import { IVoteStatusResponse } from '@/app/types/vote'; // DTO'nuzun yolunu kontrol edin

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Mevcut kullanıcının oy verdiği tüm entity'lerin listesini Backend'den çeker.
 */
async function fetchUserVotedPosts(): Promise<IVoteStatusResponse[]> {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');

    // Eğer cookie yoksa (kullanıcı giriş yapmamışsa), boş liste dön
    if (!cookieHeader) return [];

    try {
        // 🎯 Endpoint: GET /vote/user-voted-post-list
        const url = `${API_BASE_URL}/vote/user-voted-post-list`;
        
        const response = await fetch(url, {
            headers: {
                Cookie: cookieHeader, // Backend'e yetkilendirme için cookie'yi iletiyoruz
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Kullanıcıya özel dinamik veri olduğu için cache'lenmemeli
        });

        if (!response.ok) {
            console.error(`Failed to fetch voted posts: ${response.status}`);
            return [];
        }

        // Yanıtı alıyoruz (Backend'de TransformInterceptor olduğu için direkt array gelmeli)
        const result = await response.json() as IBaseResponse<IVoteStatusResponse[]>;

        return result.data || [];

    } catch (error) {
        console.error("Voted posts fetch error:", error);
        return [];
    }
}

export { fetchUserVotedPosts };