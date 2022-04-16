import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { useHistory } from "react-router-dom";

import Header from "../common/Header";

import * as cometChatService from "../../services/cometchat";
import * as firebaseService from "../../services/firebase";

import Context from "../../context";

const Home = () => {
  const [livestreams, setLivestreams] = useState([]);

  const livestreamsRef = useRef(firebaseService.getRef("livestreams"));

  const { cometChat } = useContext(Context);

  const history = useHistory();

  const loadLivestreams = useCallback(() => {
    firebaseService.getDataRealtime(livestreamsRef, onDataLoaded);
  }, []);

  const onDataLoaded = (val) => {
    if (val) {
      const keys = Object.keys(val);
      const data = keys.map((key) => val[key]);
      setLivestreams(data);
    }
  };

  useEffect(() => {
    loadLivestreams();
    return () => {
      firebaseService.offRealtimeDatabase(livestreamsRef.current);
    };
  }, [loadLivestreams]);

  const joinLivestream = (livestream) => async () => {
    try {
      await cometChatService.joinGroup(cometChat, livestream.id);
      setUpLivestream(livestream);
    } catch (error) {
      setUpLivestream(livestream);
    }
  };

  const setUpLivestream = (livestream) => {
    localStorage.setItem("livestream", JSON.stringify(livestream));
    history.push("/livestream-detail");
  };

  return (
    <React.Fragment>
      <Header />
      <div className="home">
        <div>
          {livestreams?.map((livestream) => (
            <div className="livestream__item" key={livestream.id}>
              <p className="livestream__name">{livestream.name}</p>
              <p className="livestream__content">{livestream.date}</p>
              <p className="livestream__content">{livestream.description}</p>
              <button onClick={joinLivestream(livestream)}>Join</button>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
