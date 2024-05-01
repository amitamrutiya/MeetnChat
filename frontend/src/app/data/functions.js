"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lucide_react_1 = require("lucide-react");
const uuid_1 = require("uuid");
const functions = [
    {
        title: "One-to-One Video Call",
        subtitle: "Fast and Direct Communication",
        description: "Connect instantly with another user for a direct video call. Experience seamless communication with real-time video streaming, ensuring a swift exchange of information.",
        icon1: lucide_react_1.UserRound,
        icon2: lucide_react_1.Video,
        link: `/room/one-video/${(0, uuid_1.v4)()}`,
    },
    {
        title: "Group Video Call",
        subtitle: "Collaborate with Multiple Participants",
        description: "Host video calls with multiple participants for collaborative discussions. Although slightly slower due to increased data transfer, enjoy the benefits of real-time interaction with multiple team members or friends.",
        icon1: lucide_react_1.UsersRound,
        icon2: lucide_react_1.Video,
        link: `/room/group-video/${(0, uuid_1.v4)()}`,
    },
    {
        title: "One-to-One Meeting Call",
        subtitle: "Efficient and Personalized Meetings",
        description: "Conduct efficient one-to-one meetings with colleagues or clients. Enjoy faster connection speeds for personalized discussions, allowing for effective communication and decision-making.",
        icon1: lucide_react_1.UserRound,
        icon2: lucide_react_1.MonitorPlay,
        link: `/room/one-meet/${(0, uuid_1.v4)()}`,
    },
    {
        title: "Group Meeting Call",
        subtitle: "Coordinate with Large Groups",
        description: "Organize meetings with larger groups for discussions, presentations, or brainstorming sessions. While slightly slower due to increased data handling, benefit from the ability to engage with multiple participants simultaneously.",
        icon1: lucide_react_1.UsersRound,
        icon2: lucide_react_1.MonitorPlay,
        link: `/room/group-meet/${(0, uuid_1.v4)()}`,
    },
    {
        title: "One-to-One User Chat",
        subtitle: "Instant Text Communication",
        description: "Engage in private text conversations with individual users. Experience instantaneous message delivery for seamless communication, enabling quick exchange of ideas, information, or updates.",
        icon1: lucide_react_1.UserRound,
        icon2: lucide_react_1.MessageCircleMore,
        link: `/room/one-chat`,
    },
    {
        title: "Group User Chat",
        subtitle: "Collaborative Text Communication",
        description: "Participate in group chats with multiple users for collaborative discussions or coordination. Enjoy real-time messaging with the added benefit of engaging with a larger community simultaneously.",
        icon1: lucide_react_1.UsersRound,
        icon2: lucide_react_1.MessageCircleMore,
        link: `/room/group-chat`,
    },
    {
        title: "Random Video Call",
        subtitle: "Connect with Random Users",
        description: "Connect with random users for spontaneous video calls. Experience the excitement of meeting new people while engaging in real-time video conversations.",
        icon1: lucide_react_1.UserRound,
        icon2: lucide_react_1.Video,
        link: `/room/random-video/${(0, uuid_1.v4)()}`,
    },
];
exports.default = functions;
