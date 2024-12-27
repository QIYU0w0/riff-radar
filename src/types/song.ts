// /types/song.ts
export interface Song {
    id: number;
    name: string;
    url: string;
    artists: {
        id: number, 
        name: string
    }[];
    album: {
        id: number,
        name: string,
        picUrl: string
    }
}