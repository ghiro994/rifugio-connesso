import { Announcement, AnnouncementStatus } from './types';
import { mockAnnouncements, mockRifugi } from './mockData';

// Simple in-memory store (ready to be replaced with backend)
let announcements = [...mockAnnouncements];
let nextId = 100;

export function getPublishedAnnouncements(type?: 'cerco' | 'offro') {
  return announcements.filter(
    (a) => a.status === 'pubblicato' && (!type || a.type === type)
  );
}

export function getAllAnnouncements() {
  return [...announcements];
}

export function getAnnouncementById(id: string) {
  return announcements.find((a) => a.id === id);
}

export function addAnnouncement(data: Omit<Announcement, 'id' | 'status' | 'createdAt'>) {
  const announcement: Announcement = {
    ...data,
    id: String(nextId++),
    status: 'in_attesa',
    createdAt: new Date().toISOString().split('T')[0],
  };
  announcements = [announcement, ...announcements];
  return announcement;
}

export function updateAnnouncementStatus(id: string, status: AnnouncementStatus) {
  announcements = announcements.map((a) =>
    a.id === id ? { ...a, status } : a
  );
}

export function deleteAnnouncement(id: string) {
  announcements = announcements.filter((a) => a.id !== id);
}

export function getRifugi() {
  return [...mockRifugi];
}

export function getRifugioById(id: string) {
  return mockRifugi.find((r) => r.id === id);
}
