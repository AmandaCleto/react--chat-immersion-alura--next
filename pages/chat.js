import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";

//desafios
//botao excluir mensagem ao lado de cada mensagem
//botao de enviar no input, msm efeito de enter
//loading enquanto o useeffect nao termine
//dados opacos antes de carregar
//mouse over na imagem da pessoa para ver o profile da pessoa
//mandar emojis, imagem, anexo etc

const SUPA_BASE_URL = process.env.NEXT_PUBLIC_SUPA_BASE_URL;
const SUPA_BASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPA_BASE_ANON_KEY;

const supaBaseClient = createClient(SUPA_BASE_URL, SUPA_BASE_ANON_KEY);

export default function ChatPage() {
    const [message, setMessage] = React.useState("");
    const [listMessages, setListMessages] = React.useState([]);

    React.useEffect(() => {
        supaBaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: false })
            .then(({data}) => setListMessages(data));
    }, []);

    function handleNewMessage(newMessage) {
        const message = {
            message: newMessage,
            from: "caioliveira277",
        };

        supaBaseClient
            .from('messages')
            .insert([message])
            .then(({data}) => {
                setListMessages([data[0], ...listMessages]);
        });

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
                    <MessageList messages={listMessages} />

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
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function Header() {
    return (
        <>
            <Box
                styleSheet={{
                    width: "100%",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text variant="heading5">Chat</Text>
                <Button
                    variant="tertiary"
                    colorVariant="neutral"
                    label="Logout"
                    href="/"
                />
            </Box>
        </>
    );
}

function MessageList(props) {
    return (
        <Box
        tag="ul"
        styleSheet={{
            overflow: "scroll",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column-reverse",
            flex: 1,
            color: appConfig.theme.colors.neutrals["000"],
            marginBottom: "16px",
        }}
        >
            {props.messages.map((data) => {
                return (
                    <Text
                        key={data.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: "5px",
                            padding: "6px",
                            marginBottom: "12px",
                            hover: {
                                backgroundColor:
                                    appConfig.theme.colors.neutrals[700],
                            },
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: "8px",
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    marginRight: "8px",
                                }}
                                src={`https://github.com/${data.from}.png`}
                            />
                            <Text tag="strong">{data.from}</Text>
                            <Text
                                styleSheet={{
                                    fontSize: "10px",
                                    marginLeft: "8px",
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {new Date().toLocaleDateString()}
                            </Text>
                        </Box>
                        {data.message}
                    </Text>
                );
            })}
        </Box>
    );
}
