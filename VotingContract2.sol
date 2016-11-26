{\rtf1\ansi\ansicpg1252\cocoartf1504\cocoasubrtf600
{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;\csgray\c100000;}
\paperw11900\paperh16840\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 pragma solidity ^0.4.2;\
\
contract VotingRecord \{\
    /* Public variables of the token */\
    string public standard = 'Token 0.1';\
    string public nameElection;\
    address owner;\
\
    /* This creates an array with all Voters */\
    mapping (address => uint8) public votersPool;\
    mapping (address => uint256) public candidatesPool;\
    mapping (address => bytes32) public candidatesNames;\
\
    /* event constructor - event definition */\
    event Voted(address indexed voter, address indexed candidate, bytes32 nameCandidate);\
\
    /* Initializes contract with initial supply tokens to the creator of the contract */\
    function VotingRecord(\
        address [] votersPool_,\
        address [] candidatesPool_,\
        bytes32 [] candidatesNames_,\
        string name_\
        ) \{\
            \
        owner = msg.sender; //saving contract deployer\
        \
        for (uint8 i = 0; i < votersPool_.length; i++) \{ //setting voting right (1 vote per person)\
            votersPool[votersPool_[i]] = 1;\
        \}\
        \
        for (uint8 j = 0; j < candidatesPool_.length; j++) \{ //setting candidates count (0 votes)\
            candidatesPool[candidatesPool_[j]] = 0;\
        \}\
        \
        for (uint8 z = 0; z < candidatesNames_.length; z++) \{ //creating array of valid candidates for validation\
            candidatesNames[candidatesPool_[z]] = candidatesNames_[z];\
        \}\
        \
        nameElection = name_; //storing name of election\
            \
        \}\
\
    /* Vote for candidate */\
    function voting(address _from, address _to) \{\
        if(votersPool[_from] != msg.sender) throw; //valid voter\
        if(votersPool[_from] != 1) throw; //voter can vote\
        if(candidatesNames[_to] != "") throw; //voting for valid candidate\
        votersPool[msg.sender] -= 1;\
        votersPool[_to] += 1; \
        Voted(msg.sender, _to, candidatesNames[_to]);\
    \}\
\
    /* This unnamed function is called whenever someone tries to send ether to it */\
    function () \{\
        throw;     // Prevents accidental sending of ether\
    \}\
\}}