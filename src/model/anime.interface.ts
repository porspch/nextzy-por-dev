interface Anime {
    id: string; // uuid
    name: string;
    year: number;
    studioId: string | null; // refers to Studio
}