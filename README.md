# steamy-boi
An Alexa Skill for the Steam Web API

## About
I've been wanting to learn how to make an Alexa skill for a while, and I thought it'd be best to start by making a skill I might actually use!  I'm a pretty prolific Steam user and while there are already a couple of Steam skills available for Alexa, they all seemed to have underwhelming features.  So I started my own!

It didn't take long into development to figure out why those skills seem to have underwhelming features: the [Steam Web API](https://developer.valvesoftware.com/wiki/Steam_Web_API) isn't exactly the most versatile.  Functionality you would expect, like for instance getting the game ID of a game a friend is currently playing for instance, simply isn't supported.

Still I'm planning to add a few novelty tricks and publish it to Alexa skills just for kicks, in the hope they may well add some more functionality to the Steam API at some point.  In the meantime I'll make this public because, hey, maybe someone wants to add some tricks for themselves!

This isn't the most rigorous of projects, but I'm certainly open to contributions.

## Installation
First make a copy of `config.json.example` and replace `steam_api_key` with your own api key (acquired [here](https://steamcommunity.com/dev/apikey) if you don't have one already) and the `steam_id` with your own steam id number.

To deploy you'll need your own Alexa Lambda Function and an Alexa Skill through the Alexa Developer Console using said function as an endpoint. You can then deploy code by uploading a zip of the lambda folder or, preferably, use the publish script in the root folder.  In order to use the script you'll have to have the aws CLI installed and authenticated replace the `steamyBoi` function with your own function's name.  Then just run the shell script from the command line.

Unfortunately there seems to be no way to export the Alexa Voice Interface from the Alexa Developer Console, but it shouldn't be too hard to recreate given the limited number of intents currently developed.  For the time being just make sure you have the following intents:

```
FriendsOnlineIntent
HowLongFriendsIntent
```

And give them a list of queries that you find relevant.

If I keep this project going and people show interest, I'll be sure to offer bulk-upload versions of my Intent questions in the project.

## Version History
```
v0.10 - Initial upload, includes working FriendsOnlineIntent and the start of HowLongFriendsIntent
```
