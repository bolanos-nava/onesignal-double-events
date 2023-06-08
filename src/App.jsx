import "./App.css";
import OneSignal from "react-onesignal";
import { useEffect, useState } from "react";

const constants = {
  APP_ID: "APP_ID",
};

const slidePromptOptions = {
  promptOptions: {
    slidedown: {
      prompts: [
        {
          type: "push", // current types are "push" & "category"
          autoPrompt: false,
          text: {
            actionMessage:
              "Do you want to get notifications on your cellphone?",
            acceptButton: "Allow",
            cancelButton: "Cancel",
          },
        },
      ],
    },
  },
};

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initOneSignal = () => {
      OneSignal.init({
        appId: constants.APP_ID,
        allowLocalhostAsSecureOrigin: true,
        ...slidePromptOptions,
      }).then(() => {
        setInitialized(true);
        console.log("Initialized");
      });
    };
    if (!initialized) initOneSignal();
  }, []);

  OneSignal.User.PushSubscription.addEventListener("change", () =>
    console.log("In event")
  );

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => OneSignal.Slidedown.promptPush({ force: true })}>
          Show prompt
        </button>
      </header>
    </div>
  );
}

export default App;
