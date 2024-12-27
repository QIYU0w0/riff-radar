export interface Album {
    id: number;
    name: string;
    size: number;
    picUrl: string;
    description: string;
    publishTime: string;
    artist: {
        id: number;
        name: string;
        picUrl: string;
    }
}