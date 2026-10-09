export type Photo = { src: string; title: string; date: string; credit: string; };
export type Track = { title: string; artist: string; album: string; cover: string; url?: string; isPlaying: boolean; };
export type Playlist = { name: string; description: string; cover: string; url?: string; };
export type DiaryEntry = { id: number; title: string; body: string; date: string; url: string; tags: string[]; };
export type Trace = { id: string; name: string; message: string; createdAt: string; };
