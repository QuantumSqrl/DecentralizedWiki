## Motivation

Wikis are crowdsourced, collaborative repositories of human knowledge. To better ensure the persistent availability of wiki platforms for the foreseeable future, decentralization of their data storage is necessary. To that end, we are developing a wiki platform that uses IPFS/Filecoin as the data storage layer, allowing for decentralized wiki infrastructure.

This project is building a wiki for the purpose of storing human engineering knowledge in the form of a tech tree. Using this codebase, new wiki developers can easily create their own decentralized wiki, and existing wiki maintainers can port their file storage layer over to IPFS/Filecoin. Decentralization is the future of crowdsourced internet works like wikis, and this project aims to accelerate its mass adoption.

## Usage

To use and modify this codebase to create your own decentralized wiki, do the following:

Fork this wiki and clone it by running this command on your system:
>$ git clone [url of your forked repository]

[More information on cloning a Github repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

Navigate to the folder the repository was cloned into, and install the dependencies:
>$ npm install

Start the development server:
>$ npm run dev

Now you can change the code as you see fit and the changes will be reflected live in your web browser (likely at localhost:3000, but look at the output of the previous command to be sure). 

## Modification

The landing page is located at pages/index.js

The code that generates each article is located at pages/posts/[id].js

The codebase currently uses a Firebase Realtime Database to store the CIDs. You can set one up for free [here](https://firebase.google.com/docs/database), and then you just need to change the firebaseConfig constant at the top of [id].js to reflect the url of your database.

To save to IPFS, you will need your own web3.storage client token. You can get one by creating a free account [here](https://web3.storage/).
