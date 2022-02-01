import { Box, TextField, Image } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "./components/buttonSendSticker";
import { Header } from "./components/header";
import { MessageList } from "./components/messageList";

//desafios
//botao excluir mensagem ao lado de cada mensagem
//botao de enviar no input, msm efeito de enter
//loading enquanto o useeffect nao termine
//dados opacos antes de carregar
//mandar emojis, imagem, anexo etc

const SUPA_BASE_URL = process.env.NEXT_PUBLIC_SUPA_BASE_URL;
const SUPA_BASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPA_BASE_ANON_KEY;

const supaBaseClient = createClient(SUPA_BASE_URL, SUPA_BASE_ANON_KEY);

export default function ChatPage() {
    const [message, setMessage] = React.useState("");
    const [listMessages, setListMessages] = React.useState([]);
    const route = useRouter();
    const userLogged = route.query.username;
    const [isLoading, setIsLoading] = React.useState(true);

    function listenMessagesInRealTime(addMessage) {
        return supaBaseClient
            .from("messages")
            .on("INSERT", ({ new: newMessage }) => {
                addMessage(newMessage);
            })
            .subscribe();
    }

    React.useEffect(() => {
        supaBaseClient
            .from("messages")
            .select("*")
            .order("id", { ascending: false })
            .then(({ data }) => {
                setListMessages(data);
            });

        listenMessagesInRealTime((newMessage) => {
            setListMessages((currentValue) => {
                return [newMessage, ...currentValue];
            });

        });

        setIsLoading(false);
    }, []);

    function handleNewMessage(newMessage) {
        const message = {
            message: newMessage,
            from: userLogged,
        };

        supaBaseClient
            .from("messages")
            .insert([message])
            .then(() => {});

        setMessage("");
    }

    return (
        <Box
            styleSheet={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "multiply",
                color: appConfig.theme.colors.neutrals["000"],
            }}
        >
            <Box
                styleSheet={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                    borderRadius: "5px",
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: "100%",
                    maxWidth: "95%",
                    maxHeight: "95vh",
                    padding: "32px",
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: "relative",
                        display: "flex",
                        flex: 1,
                        height: "80%",
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: "column",
                        borderRadius: "5px",
                        padding: "16px",
                    }}
                >
                    {isLoading ? (
                        <Box
                            styleSheet={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Image
                                src={`https://amandacleto.github.io/images-for-projects/public/images/react-chat-alura-next/icon-spinner-gray.png`}
                                className="rotate"
                                styleSheet={{
                                    width: "50x",
                                    height: "50x",
                                }}
                            />
                        </Box>
                    ) : (
                        <MessageList messages={listMessages} />

                        )}

                    <Box
                        as="form"
                        styleSheet={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            value={message}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleNewMessage(message);
                                }
                            }}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: "100%",
                                border: "0",
                                resize: "none",
                                borderRadius: "5px",
                                padding: "6px 8px",
                                backgroundColor:
                                    appConfig.theme.colors.neutrals[800],
                                marginRight: "12px",
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                handleNewMessage(`:sticker:${sticker}`);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
