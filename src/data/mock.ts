import { Photo, Track, Playlist, DiaryEntry, Trace } from '../types';

export const gallery: Photo[] = [
  { src: "https://images.unsplash.com/photo-1743456131099-ea30c6da59f2?auto=format&fit=crop&w=1000&q=85", title: "Passing strangers", date: "11.24", credit: "Olegs Jonins" },
  { src: "https://images.unsplash.com/photo-1625039162908-19d625adbaac?auto=format&fit=crop&w=1000&q=85", title: "Headlights, going home", date: "02.25", credit: "Foad Roshan" },
  { src: "https://images.unsplash.com/photo-1514789493525-341ba29ecd96?auto=format&fit=crop&w=1000&q=85", title: "Momentum", date: "04.25", credit: "Shaouraav Sarose Shreshtha" },
  { src: "https://images.unsplash.com/photo-1723739012018-f401c2f0e758?auto=format&fit=crop&w=1000&q=85", title: "One light left on", date: "08.25", credit: "Ksenia Pixelesse" },
  { src: "https://images.unsplash.com/photo-1592912487122-4a2c0b82e107?auto=format&fit=crop&w=1000&q=85", title: "After the rain", date: "09.25", credit: "Annie Spratt" },
  { src: "https://images.unsplash.com/photo-1496492813606-88559707e685?auto=format&fit=crop&w=1000&q=85", title: "Night signals", date: "12.25", credit: "Mattias Diesel" },
];

export const demoTrack: Track = { title: "Solitude", artist: "M83", album: "Junk", cover: "https://images.unsplash.com/photo-1606870655535-083046002342?auto=format&fit=crop&w=600&q=85", isPlaying: true };

export const demoPlaylists: Playlist[] = [
  { name: "night bus home", description: "streetlights through a fogged window", cover: "https://images.unsplash.com/photo-1496492813606-88559707e685?auto=format&fit=crop&w=500&q=80" },
  { name: "atmosphere", description: "making a moment feel larger and more distant", cover: "https://images.unsplash.com/photo-1592912487122-4a2c0b82e107?auto=format&fit=crop&w=500&q=80" },
  { name: "anti-frame", description: "beautiful things with rough edges", cover: "https://images.unsplash.com/photo-1622036900418-5805b072d6c1?auto=format&fit=crop&w=500&q=80" },
];

export const demoDiary: DiaryEntry[] = [
  { id: 1, title: "The Anti-Frame", body: "I don't want imperfection added merely as a stylistic effect. I want it to feel natural, as though the photograph was genuinely experienced rather than manufactured.", date: "October 18, 2025", url: "#diary", tags: ["photography", "philosophy"] },
  { id: 2, title: "On leaving things unfinished", body: "Some things are finished; some are still developing; some are simply worth keeping. I don't need to reveal everything about myself. Personal does not have to mean completely exposed.", date: "September 02, 2025", url: "#diary", tags: ["fragments"] },
  { id: 3, title: "LMAOOOO WHAT THE FUCK", body: "I can appreciate an atmospheric photograph and then give it a caption that completely undermines the seriousness of the image. Sometimes I would rather make something funny than make it sound poetic.", date: "August 11, 2025", url: "#diary", tags: ["absurd", "casual"] },
];

export const demoTraces: Trace[] = [
  { id: "demo-1", name: "Freyja", message: "A world that felt as though it existed before I arrived and will continue to exist after I leave.", createdAt: "2025-10-02T10:00:00.000Z" },
  { id: "demo-2", name: "Anonymous", message: "Sometimes, what stays with us isn't the thing itself, but the impression it leaves behind.", createdAt: "2025-09-21T10:00:00.000Z" },
  { id: "demo-3", name: "Ren", message: "Left a small hello. Please keep the lamp on.", createdAt: "2025-09-08T10:00:00.000Z" },
  { id: "demo-4", name: "Stranger", message: "This feels like opening a box of photographs and finding a record someone left playing.", createdAt: "2025-08-30T10:00:00.000Z" },
  { id: "demo-5", name: "M.", message: "A passing hello.", createdAt: "2025-08-25T10:00:00.000Z" },
  { id: "demo-6", name: "Haga", message: "Proof I was here.", createdAt: "2025-08-20T10:00:00.000Z" },
  { id: "demo-7", name: "Visitor", message: "I love the M83 track. Fits perfectly.", createdAt: "2025-08-15T10:00:00.000Z" },
];
