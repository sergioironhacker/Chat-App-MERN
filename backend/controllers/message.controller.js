import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!message) {
            return res.status(400).json({ error: "Message content is required" });
        }

        // Busca la conversación entre los participantes
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // Si no existe la conversación, la crea
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: [], // Asegura que el arreglo de mensajes exista
            });
        }

        // Crea y guarda el mensaje
        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            message: message,
        });


        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        /* await conversation.save();
        await newMessage.save(); */

        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getMessages = async (req, res) => {
    try {

        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}