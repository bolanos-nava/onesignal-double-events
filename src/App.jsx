import "./App.css";
import OneSignal from "react-onesignal";
import { useEffect, useState } from "react";

const constants = {
  APP_ID: "APP_ID",
  CURRENT_USER: 121212,
}

// Check if OneSignalServicewWorker is already installed so we don't initialize twice
async function isOneSignalWorkerInstalled() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const oneSignalSWInstalled = registrations.some(
      (r) => r.active && r.active.scriptURL.match("OneSignalSDKWorker")
    );
    return oneSignalSWInstalled;
  }
  return true;
}

function App() {
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    isOneSignalWorkerInstalled().then((installed) => {
      console.log({ installed });
      if (!installed) {
        console.log("Initializing");
        OneSignal.init({
          appId: constants.APP_ID,
          allowLocalhostAsSecureOrigin: true,
          promptOptions: {
            slidedown: {
              prompts: [
                {
                  type: "category",
                  autoPrompt: true,
                  text: {
                    actionMessage:
                      "Escoge las notificaciones que te gustaría recibir en tu celular",
                    acceptButton: "Permitir",
                    cancelButton: "Cancelar",

                    /* CATEGORY SLIDEDOWN SPECIFIC TEXT */
                    // shown when category slidedown is re-shown tp update preferences
                    negativeUpdateButton: "Cancelar",
                    positiveUpdateButton: "Guardar preferencias",
                    updateMessage:
                      "Actualiza tus preferencias de notificaciones",
                  },
                  delay: {
                    pageViews: 1,
                    timeDelay: 20,
                  },
                  categories: [
                    {
                      tag: "category_1",
                      label: "Cateogry 1",
                    },
                    {
                      tag: "category_2",
                      label: "Category 2",
                    },
                    {
                      tag: "category_3",
                      label: "Category 3",
                    },
                  ],
                },
              ],
            },
          },
        }).then(() => {
          OneSignal.setDefaultTitle("Test notification");
          OneSignal.showCategorySlidedown();
          OneSignal.setExternalUserId(constants.CURRENT_USER.toString());
        });
      }
    });
  }, []);

  OneSignal.on("subscriptionChange", function (isSubscribed) {
    if (isSubscribed) OneSignal.getUserId().then((id) => console.log({ id }));
    OneSignal.isPushNotificationsEnabled(function (enabled) {
      console.log({ enabled });
    });
  });

  useEffect(() => {
    if (pushed) {
      console.log("In function");
      const promise = OneSignal.getUserId();
      console.log({ promise });
      promise
        .then((playerId) => console.log({ playerId }))
        .catch((error) => console.log({ error }));
    }
    return () => setPushed(false);
  }, [pushed]);

  return (
    <div className="App">
      <header className="App-header">
        <button type="button" onClick={() => setPushed(true)}>
          Get player id
        </button>
      </header>
    </div>
  );
}

export default App;
