export interface Evento {
    id: number;
    title: string;
    coverImageUrl: string;
    producerName: string;
    venueName: string;
    city: string;
    state: string;
    startDate: string;
    endDate: string | null;
    price: number;
    isSoldOut: boolean;
    genres: string[];
}