import { chatRooms } from "../schemas/chat.schema";
import { conversations } from "../schemas/chat.schema";


export const isChatExisting = async (idOne: string | number, idTwo: string) => {
    const chatInfo: any = await chatRooms.findOne({ 
        participants: {$size: 2, $all : [idOne, idTwo]}
     }).populate('conversations');

    return chatInfo;
}

export const isChatIdExisting = async (chatId: string) => {

    const chatInfo: any = await chatRooms.findOne({ chatId: chatId }).populate('conversations');

    return chatInfo;
}

export const createChat = async (chatData: any) => {
    const chatInfo = await chatRooms.create(chatData);
    return chatInfo;
}

/** Used to get a specific chat conversations */
export const getChats = async (chatId: string) => {
    const chatInfo: any = await chatRooms.findOne({ isActive: true, chatId: chatId }).populate('conversations');
    return chatInfo;
}

/** Used to get a specific chat conversations */
export const getUnreadChats = async (chatId: string) => {
   

   try {

    /**@example this block code return all the data plus the main result as two array */
    const chatInfo: any = await conversations.aggregate([
        { "$project": {
            "conversation": { "$setDifference": [
                { "$map": {
                    "input": "$conversation",
                    "as": "el",
                    "in": {"$cond": [
                        { "$eq": [ "$$el.isRead", false ] },
                        "$$el",
                        false
                    ]}
                }},
                [false]
            ]}
        }}
    ]);


    // const chatInfo: any = await conversations.aggregate([
    //     {
    //       $addFields: {
    //         conversation: {
    //           $filter: {
    //             input: "$conversation",
    //             as: "data",
    //             cond: {
    //               $gt: [
    //                 "$$data.isRead",
    //                 false
    //               ]
    //             }
    //           }
    //         }
    //       }
    //     }
    //   ]);

     /** @example for getting a single unread message */
    // const chatInfo: any = await conversations.find(
    //     {chatId: chatId}, 
    //     {"conversation" : {$elemMatch: {"isRead": false}}}
    // );

    return chatInfo;
   } catch (error) {
    console.log("error from unred ", error);
    return null
   }

    
}

/** used to add user into a groupm chat */
export const addUserToGroup = async (chatId: string, userId: string) => {
    const chatInfo: any = await chatRooms.findOne({ isActive: true, chatId: chatId });
    if (chatInfo) {
        // update the participants
        return await chatRooms.updateOne(
            { chatId: chatId },
            { $addToSet: { participants: userId } },
            { new: true }
        );
    }
    else {
        return false;
    }
}

/** Used to make a chat inactive */
export const closeChat = async (chatId: string) => {
    const chatInfo: any = await chatRooms.findOne({ isActive: true, chatId: chatId });
    if (chatInfo) {
        // update the participants
        return await chatRooms.updateOne(
            {chatId: chatId},
            { isActive: false }
        );
    }
    else {
        return false;
    }
}

/**
 * Used to get all users active chats
 * @param userId - user Id
 * @returns 
 */
export const getUserChats = async (userId: string) => {
    const chatInfo: any = await chatRooms.find({ participants: { $all: [userId] }, isActive: true }).populate('conversations');
    return chatInfo;
}

export const createConversation = async (conversationData: any) => {
    const chatInfo = await conversations.create(conversationData);
    return chatInfo;
}

export const getConversation = async (chatId: string) => {
    const chatInfo: any = await conversations.findOne({ chatId: chatId });
    return chatInfo;
}

export const updateConversation = async (data: any) => {
    try {
        const conversation: any = await conversations.findOne({ chatId: data.chatId });
        if (conversation) {
            // update the conversation
            return await conversations.updateOne(
                { chatId: data.chatId },
                { $addToSet: { conversation: data.conversation[0] } },
                { new: true }
            );
        }
        else {
            return false;
        }
    } catch (error) {
        // console.log("error from db", error);
    }
}

export const acknowledgeMessage = async (chatId: string, messageId: string) => {
    if (chatId && messageId) {
        // update the conversation
        const resp =  await conversations.findOneAndUpdate(
            { $and: [ {chatId: chatId}, {"conversation" : {$elemMatch: {"messageId": messageId}}}] }
            , { $set: {
                "conversation.$.isRead": true
            }
             });
             return resp      
    }
    else {
        return false;
    }
}

export const deleteMessage = async (chatId: string, messageId: string) => {
    const resp =  await conversations.updateOne(
        {chatId: chatId},
        {
          $pull: {
              "conversation": {"messageId": messageId}
           } 
        }, {safe:true}
       );
    return resp 
}