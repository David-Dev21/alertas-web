// Service Worker para Firebase Cloud Messaging
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA1fsYZAsKZsjUglczB9GL_T97C2u4BgEo",
  authDomain: "sistema-alertas-felcv.firebaseapp.com",
  projectId: "sistema-alertas-felcv",
  storageBucket: "sistema-alertas-felcv.firebasestorage.app",
  messagingSenderId: "403229043292",
  appId: "1:403229043292:web:2c9e68df0742c2d7541499",
  measurementId: "G-ZFPRGFBD18"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener instancia de messaging
const messaging = firebase.messaging();

// Manejar mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "Nueva alerta";
  const notificationOptions = {
    body: payload.notification?.body || "Tienes una nueva notificación",
    icon: "/logos/logo-felcv.webp",
    badge: "/logos/logo-felcv.webp",
    tag: payload.data?.alertaId || "alerta-general",
    data: payload.data,
    requireInteraction: true,
    vibrate: [200, 100, 200],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clicks en las notificaciones
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || "/alertas-activas";
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
