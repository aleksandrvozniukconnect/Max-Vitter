// Офлайн-режим в первую версию не входит. Этот файл снимает сервис-воркер, который мог остаться у тех,
// кто открывал прежнюю версию страницы, и очищает его кеш.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.registration.unregister()));
});
