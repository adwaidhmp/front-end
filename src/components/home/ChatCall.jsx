import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyTrainers,
  clearTrainerState,
  removeTrainer,
} from "../../redux/user_slices/trainerBookingSlice";

import {
  fetchChatRooms,
  fetchChatHistory,
  setActiveRoom,
} from "../../redux/chatSlice";

import { useChatSocket } from "../../hooks/useChatSocket";

import {
  MessageSquare,
  Video,
  Phone,
  Send,
  ChevronLeft,
  Search,
  Paperclip,
  CheckCheck,
  Star,
  Trash2,
} from "lucide-react";

import { Modal, message } from "antd";

const { confirm } = Modal;

const STATUS_COLOR = {
  approved: "bg-green-500",
  pending: "bg-yellow-400",
  rejected: "bg-red-500",
  cancelled: "bg-gray-500",
};

const TrainerChat = () => {
  const dispatch = useDispatch();

  /* =======================
     REDUX STATE
  ======================== */
  const { myTrainers, loading, error } = useSelector(
    (state) => state.trainerBooking
  );

  const { rooms, activeRoomId, messagesByRoom } = useSelector(
    (state) => state.chat
  );

  /* =======================
     LOCAL STATE
  ======================== */
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  const messagesEndRef = useRef(null);

  /* =======================
     SOCKET
  ======================== */
  const { sendText } = useChatSocket(activeRoomId);

  /* =======================
     INIT
  ======================== */
  useEffect(() => {
    dispatch(fetchMyTrainers());
    dispatch(fetchChatRooms());
    return () => dispatch(clearTrainerState());
  }, [dispatch]);

  /* =======================
     AUTO SCROLL
  ======================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByRoom, activeRoomId]);

  /* =======================
     RESPONSIVE
  ======================== */
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) setShowChatList(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =======================
     SELECT TRAINER
  ======================== */
  const handleSelectTrainer = (trainer) => {
    setSelectedTrainer(trainer);

    if (trainer.status !== "approved") {
      message.info(`Trainer is ${trainer.status}. Chat not available.`);
      return;
    }

    const room = rooms.find(
      (r) => r.trainer === trainer.trainer_user_id
    );

    if (!room) {
      message.warning("Chat room not ready yet");
      return;
    }

    dispatch(setActiveRoom(room.id));
    dispatch(fetchChatHistory(room.id));

    if (isMobileView) setShowChatList(false);
  };

  /* =======================
     REMOVE TRAINER
  ======================== */
  const handleRemoveTrainer = () => {
    if (!selectedTrainer) return;

    confirm({
      title: "Remove trainer?",
      content: "This will remove the trainer and chat access.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        try {
          await dispatch(removeTrainer()).unwrap();
          message.success("Trainer removed");

          setSelectedTrainer(null);
          dispatch(setActiveRoom(null));
          dispatch(fetchMyTrainers());
        } catch (err) {
          message.error(err?.detail || "Failed to remove trainer");
        }
      },
    });
  };

  /* =======================
     SEND MESSAGE
  ======================== */
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeRoomId) return;
    if (selectedTrainer?.status !== "approved") return;

    sendText(newMessage.trim());
    setNewMessage("");
  };

  /* =======================
     SEARCH (OPTIONAL)
  ======================== */
  const visibleTrainers = myTrainers.filter((t) =>
    searchTerm.trim()
      ? t.trainer_name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-gray-300">
        Loading trainers...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-red-400">
        {error}
      </div>
    );

  const messages = activeRoomId
    ? messagesByRoom[activeRoomId] || []
    : [];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* TRAINER LIST */}
      <div
        className={`${
          showChatList ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-96 border-r border-gray-800`}
      >
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">My Trainers</h2>

          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search trainers..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {visibleTrainers.map((trainer) => (
            <div
              key={trainer.booking_id}
              onClick={() => handleSelectTrainer(trainer)}
              className={`p-5 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold">
                    {trainer.trainer_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        STATUS_COLOR[trainer.status] || "bg-gray-400"
                      }`}
                    />
                    <span className="text-xs text-gray-400 capitalize">
                      {trainer.status}
                    </span>
                  </div>
                </div>

                {trainer.rating && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <span>{trainer.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 flex flex-col">
        {!selectedTrainer ||
        selectedTrainer.status !== "approved" ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare size={48} />
            <p className="mt-4">
              {selectedTrainer
                ? `Chat unavailable (${selectedTrainer.status})`
                : "Select a trainer"}
            </p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-4 border-b border-gray-800 flex justify-between">
              <div className="flex items-center gap-3">
                {isMobileView && (
                  <button onClick={() => setShowChatList(true)}>
                    <ChevronLeft />
                  </button>
                )}
                <h3 className="text-white font-bold">
                  {selectedTrainer.trainer_name}
                </h3>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRemoveTrainer}
                  className="p-2 bg-red-600 rounded"
                >
                  <Trash2 />
                </button>
                <button className="p-2 bg-gray-800 rounded">
                  <Phone />
                </button>
                <button className="p-2 bg-gray-800 rounded">
                  <Video />
                </button>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 flex ${
                    msg.is_mine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-md ${
                      msg.is_mine
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    {msg.text}
                    <div className="text-xs mt-1 opacity-70 flex justify-end">
                      <CheckCheck size={14} />
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-4 border-t border-gray-800 flex gap-2">
              <button className="p-2 bg-gray-800 rounded">
                <Paperclip />
              </button>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white rounded px-4"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-600 rounded"
              >
                <Send />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrainerChat;
