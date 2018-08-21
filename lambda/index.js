/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */

const Alexa = require('ask-sdk-core');

var friends = {};

const request = require('request');

const conf = require("./config.json");
const steamKey = conf.steam_api_key;
const steamId = conf.steam_id;

const personastates = [
  'offline',                 // 0
  'online',                  // 1
  'busy',                    // 2
  'away',                    // 3
  'snooze',                  // 4
  'looking to trade',        // 5
  'looking to play'          // 6
];

const skillBuilder = Alexa.SkillBuilders.custom();

function refreshFriends() {
  // Get the friends list
  const friendsURL = 'http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=' + steamKey + '&steamid=' + steamId + '&relationship=friend';

  request(friendsURL, function (error, response, body) {
    let rawFriends = JSON.parse(body).friendslist.friends;
    let i,j,tempArray,chunk = 100;
    for (i=0,j=rawFriends.length; i<j; i+=chunk) {
      tempArray = rawFriends.slice(i,i+chunk);
      friendIds = tempArray.map(e => e.steamid).join(",");

      const detailsURL = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + steamKey + '&steamids=' + friendIds;
      request(detailsURL, function (error, response, body) {
        JSON.parse(body).response.players.forEach(function(e) {
          friends[e.personaname] = e;
        })
      });
    }
  });
}

/* INTENT HANDLERS */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    refreshFriends();
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  handle(handlerInput) {
    refreshFriends();
    return handlerInput.responseBuilder
      .speak(welcomeMessage)
      .reprompt(helpMessage)
      .getResponse();
  },
};

const OldestFriendsHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    console.log(request);
    console.log("Inside OldestFriendsHandler");
    console.log(JSON.stringify(request));
    return request.type === "IntentRequest" && request.intent.name === "OldestFriendsIntent";
  },
  handle(handlerInput) {
    console.log("Inside OldestFriendsHandler - handle");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const response = handlerInput.responseBuilder;

    let friendsCopy = Object.assign({}, friends);

    let sorted = [];
    let zeroIndex = 0;

    for (var friend in friends) {
      if (friend.friend_since)
        sortable.push([friend, Speed[vehicle]]);
    }

    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });

  }
}

const OnlineFriendsHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    console.log(request);
    console.log("Inside OnlineFriendsHandler");
    console.log(JSON.stringify(request));
    return request.type === "IntentRequest" && request.intent.name === "FriendsOnlineIntent";
  },
  handle(handlerInput) {
    console.log("Inside OnlineFriendsHandler - handle");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const response = handlerInput.responseBuilder;

    let friendsOnline = [];
    let friendsLookingToPlay = [];
    let speakOutput = '';

    console.log(friends);
    for (let personaname in friends) {
      let e = friends[personaname];
      if (e.personastate == 1) {
        friendsOnline.push(e.personaname);
      } else if (e.personastate == 6) {
        friendsLookingToPlay.push(e.personaname);
      }
    }

    if (friendsOnline.length > 0) {
      if (friendsOnline.length == 1) {
        speakOutput += friendsOnline[0] + " is currently your only friend online. ";
      } else {
        for (let i = 0; i < friendsOnline.length; i++) {
          if (i == friendsOnline.length - 1) {
            speakOutput += ' and ';
          }
          speakOutput += friendsOnline[i] + ', ';
        }
        speakOutput += ' are currently online. ';
      }
    } else {
      speakOutput = "Currently none of your friends are online. ";
    }

    if (friendsLookingToPlay.length > 0) {
      if (friendsLookingToPlay.length == 1) {
        speakOutput += friendsLookingToPlay[0] + " is looking to play! ";
      } else {
        for (let i = 0; i < friendsLookingToPlay.length; i++) {
          if (i == friendsLookingToPlay.length - 1) {
            speakOutput += ' and ';
          }
          speakOutput += friendsLookingToPlay[i] + ', ';
        }
        speakOutput += ' are looking to play! ';
      }
    }

    return response.speak(speakOutput)
             .reprompt(speakOutput)
             .getResponse();
  }
}

const HelpHandler = {
  canHandle(handlerInput) {
    console.log("Inside HelpHandler");
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
           request.intent.name === 'AMAZON.HelpHandler';
  },
  handle(handlerInput) {
    console.log("Inside HelpHandler - handle");
    return handlerInput.responseBuilder
      .speak(helpMessage)
      .reprompt(helpMessage)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    console.log("Inside ExitHandler");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    return request.type === `IntentRequest` && (
              request.intent.name === 'AMAZON.StopIntent' ||
              request.intent.name === 'AMAZON.PauseIntent' ||
              request.intent.name === 'AMAZON.CancelIntent'
           );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(exitSkillMessage)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    console.log("Inside ErrorHandler");
    return true;
  },
  handle(handlerInput, error) {
    console.log("Inside ErrorHandler - handle");
    console.log(`Error handled: ${JSON.stringify(error)}`);
    console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);

    return handlerInput.responseBuilder
      .speak(helpMessage)
      .reprompt(helpMessage)
      .getResponse();
  },
};

const welcomeMessage = `Welcome to <say-as interpret-as='interjection'>Steamy Boi</say-as>!  You can find out if your friends are online, what's new for your recently played games, and more!  What would you like to do?`;
const helpMessage = `I can take a look at details from your Steam profile and tell you which of your friends are online or if there is any news for your recently played games.  What would you like to do?`;
const useCardsFlag = true;

/* HELPER FUNCTIONS */

function getSmallImage(item) {
  return ``;
}

function getLargeImage(item) {
  return ``
}

function getImage(height, width, label) {
  return imagePath.replace("{0}", height)
    .replace("{1}", width)
    .replace("{2}", label);
}

function getBackgroundImage(label, height = 1024, width = 600) {
  return backgroundImagePath.replace("{0}", height)
    .replace("{1}", width)
    .replace("{2}", label);
}

function getRandom(min, max) {
  return Math.floor((Math.random() * ((max - min) + 1)) + min);
}

/* LAMBDA SETUP */
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    OnlineFriendsHandler,
    OldestFriendsHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();