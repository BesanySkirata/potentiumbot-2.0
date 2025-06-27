# potentiumbot-2.0
A bot for the Potentium Order discord server

Updated for discord.js v14

## What it does
This bot is designed to assist officers in The Potentium Order (a SWGOH guild alliance) by keeping track of various pieces of guild data. It collects this via API and displays it in an embed.

## Commands
### /status
Provides an overview of the guilds member counts and total GP

![image](https://github.com/user-attachments/assets/1aa7b95d-66e6-455f-8de7-b4ab2d2dc0ce)

### /allies
Grabs individual player GP, fleet arena rank, and number of owned datacrons for Allies of the Force.
Due to size limits on Discord embeds, this is done across two of them. Currently set to ephemeral for channel readability when used.

![image](https://github.com/user-attachments/assets/025ed54a-840d-4248-ae2e-1547b80d2e74)
![image](https://github.com/user-attachments/assets/5973dc3c-48f1-4e40-a2fb-9a624ffcca58)

## To Do
- Generalize /allies into /guild <guild_id>, where guild_id is the section of the swgoh.gg URL after /g/, i.e. https://swgoh.gg/g/pIc8G4IAQIqb6yhdJbZLLA/ to make it more accessible
- Add more data points into /guild after creation, or write additional commands that pull specific datapoints as needed
- Explore incorporating /swgoh-utils/swgoh-comlink calls as an alternative that may allow for name-based search for commands
