import React, { useRef, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

import Header from "../common/Header";

import Context from "../../context";

import * as cometChatService from "../../services/cometchat";
import * as firebaseService from "../../services/firebase";
import * as uiService from "../../services/ui";

const CreateLiveStream = () => {
  const livestreamNameRef = useRef("");
  const livestreamDateRef = useRef("");
  const livestreamDescriptionRef = useRef("");

  const { user, cometChat } = useContext(Context);

  const createLivestream = async () => {
    try {
      const { livestreamName, livestreamDate, livestreamDescription } =
        getInputs();
      if (
        isLiveStreamValid({
          livestreamName,
          livestreamDate,
          livestreamDescription,
        })
      ) {
        uiService.showLoading();
        const livestreamId = uuidv4();
        await cometChatService.createGroup({
          cometChat,
          id: livestreamId,
          name: livestreamName,
        });
        await insertFirebase({
          livestreamId,
          livestreamName,
          livestreamDate,
          livestreamDescription,
        });
        resetForm();
        uiService.hideLoading();
        uiService.alert(`${livestreamName} was created successfully`);
      }
    } catch (error) {
      uiService.alert(`Failure to create your livestream, please try again`);
    }
  };

  const getInputs = () => {
    const livestreamName = livestreamNameRef.current.value;
    const livestreamDate = livestreamDateRef.current.value;
    const livestreamDescription = livestreamDescriptionRef.current.value;
    return { livestreamName, livestreamDate, livestreamDescription };
  };

  const isLiveStreamValid = ({
    livestreamName,
    livestreamDate,
    livestreamDescription,
  }) => {
    if (validator.isEmpty(livestreamName)) {
      uiService.alert("Please input the livestream name");
      return false;
    }
    if (validator.isEmpty(livestreamDate)) {
      uiService.alert("Please input the livestream date");
      return false;
    }
    if (validator.isEmpty(livestreamDescription)) {
      uiService.alert("Please input the livestream description");
      return false;
    }
    return true;
  };

  const insertFirebase = async ({
    livestreamId,
    livestreamName,
    livestreamDate,
    livestreamDescription,
  }) => {
    await firebaseService.insert({
      key: "livestreams",
      id: livestreamId,
      payload: {
        id: livestreamId,
        name: livestreamName,
        date: livestreamDate,
        description: livestreamDescription,
        createdBy: user,
      },
    });
  };

  const resetForm = () => {
    livestreamNameRef.current.value = "";
    livestreamDateRef.current.value = "";
    livestreamDescriptionRef.current.value = "";
  };

  return (
    <React.Fragment>
      <Header />
      <div className="create-livestream">
        <div className="create-livestream__content">
          <div className="create-livestream__container">
            <div className="create-livestream__title">Create Livestream</div>
          </div>
          <div className="create-livestream__form">
            <input
              type="text"
              placeholder="Livestream Name"
              ref={livestreamNameRef}
            />
            <input
              type="text"
              placeholder="Livestream Date"
              ref={livestreamDateRef}
            />
            <textarea
              placeholder="Livestream Description"
              ref={livestreamDescriptionRef}
            ></textarea>
            <button
              className="create-livestream__btn"
              onClick={createLivestream}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreateLiveStream;
