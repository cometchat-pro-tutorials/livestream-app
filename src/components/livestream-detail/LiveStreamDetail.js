import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";

import { CometChatMessages } from "../../cometchat-pro-react-ui-kit/CometChatWorkspace/src";
import LiveStreamHeader from "../livestream-header/LiveStreamHeader";

import Context from "../../context";

const LiveStreamDetail = () => {
  const [livestream, setLivestream] = useState(null);

  const { cometChat } = useContext(Context);

  const history = useHistory();

  useEffect(() => {
    const livestream = JSON.parse(localStorage.getItem("livestream"));
    if (livestream) {
      setLivestream(livestream);
    }
  }, []);

  useEffect(() => {
    if (livestream && cometChat) {
      startDirectCall();
    }
  }, [livestream, cometChat]);

  const startDirectCall = () => {
    if (cometChat && livestream) {
      const sessionID = livestream.id;
      const audioOnly = false;
      const defaultLayout = true;
      const callSettings = new cometChat.CallSettingsBuilder()
        .enableDefaultLayout(defaultLayout)
        .setSessionID(sessionID)
        .setIsAudioOnlyCall(audioOnly)
        .build();
      cometChat.startCall(
        callSettings,
        document.getElementById("call__screen"),
        new cometChat.OngoingCallListener({
          onUserListUpdated: (userList) => {},
          onCallEnded: (call) => {
            history.push("/");
          },
          onError: (error) => {
            history.push("/");
          },
          onMediaDeviceListUpdated: (deviceList) => {},
          onUserMuted: (userMuted, userMutedBy) => {},
          onScreenShareStarted: () => {},
          onScreenShareStopped: () => {},
        })
      );
    }
  };

  if (!livestream || !cometChat) return <React.Fragment></React.Fragment>;

  return (
    <React.Fragment>
      <LiveStreamHeader livestream={livestream} />
      <div className="livestream">
        <div className="livestream__left">
          <div id="call__screen"></div>
        </div>
        <div className="livestream__right">
          <CometChatMessages chatWithGroup={livestream.id} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default LiveStreamDetail;
