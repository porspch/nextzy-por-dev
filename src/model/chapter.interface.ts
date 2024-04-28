interface Chapter {
    id: string; // uuid
    name: string;
    studioId: string | null; // refers to Studio
    animeId: string | null; // refers to Anime
    duration: number; // integer number
}