import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase solo una vez
let app: FirebaseApp;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Analytics solo en el navegador
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Messaging solo en el navegador
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export { app, analytics, messaging };

/**
 * Solicita permiso para notificaciones push y obtiene el token FCM
 */
export const solicitarPermisoNotificaciones = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.warn("Firebase Messaging no está disponible");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Registrar el service worker
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
        scope: "/",
      });

      // Esperar a que esté activo
      await navigator.serviceWorker.ready;

      // Obtener el token FCM
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        return token;
      } else {
        console.warn("No se pudo obtener el token FCM");
        return null;
      }
    } else {
      console.warn("Permiso de notificaciones denegado");
      return null;
    }
  } catch (error) {
    console.error("Error al solicitar permiso de notificaciones:", error);

    // Detectar si es Brave y dar un mensaje más útil
    if ((navigator as any).brave && error instanceof Error && error.message.includes("push service error")) {
      console.error("⚠️ Brave Browser: Activa 'Google Services for push messaging' en brave://settings/privacy");
    }

    return null;
  }
};

/**
 * Escucha mensajes en primer plano
 */
export const escucharMensajesPrimerPlano = (callback: (payload: any) => void): (() => void) | null => {
  if (!messaging) {
    console.warn("Firebase Messaging no está disponible");
    return null;
  }

  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};
