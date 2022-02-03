import { Box, Text, Image } from "@skynexui/components";
import React from "react";
import { useEffect } from "react/cjs/react.development";
import appConfig from "../../config.json";
import { supaBaseClient } from "../../config";

export function MessageList(props) {
    const [isImageClicked, setIsImageClicked] = React.useState({});
    const [userInfo, setUserInfo] = React.useState({});
    const [messages, setMessages] = React.useState(props.messages);

    useEffect(() => {
        setMessages(props.messages);
    }, [props.messages]);

    async function onImageClick(username, messageId) {
        if (!isImageClicked[messageId]) {
            setIsImageClicked({
                ...isImageClicked,

                [messageId]: true,
            });

            if (userInfo[username]) {
                return;
            }

            const data = await fetchData(
                `https://api.github.com/users/${username}`
            );

            setUserInfo({
                ...userInfo,

                [username]: {
                    bio: data.bio,
                    html_url: data.html_url,
                },
            });
        } else {
            setIsImageClicked({
                ...isImageClicked,

                [messageId]: false,
            });
        }
    }

    async function fetchData(infoApi) {
        const response = await fetch(infoApi);

        return response.json();
    }

    function deleteMessage(id) {
        const messagesFiltered = messages.filter((message) => {
            if (message.id == id) {
                return false;
            }

            return true;
        });

        supaBaseClient
            .from("messages")
            .delete()
            .match({ id: id })
            .then(() => {});

        setMessages(messagesFiltered);
    }

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
            {(messages || []).map((data) => {
                return (
                    <Text
                        key={data.id}
                        tag="li"
                        styleSheet={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderRadius: "5px",
                            padding: "6px",
                            marginBottom: "12px",
                            hover: {
                                backgroundColor:
                                    appConfig.theme.colors.neutrals[700],
                            },
                        }}
                    >
                        <Box>
                            <Box
                                styleSheet={{
                                    marginBottom: isImageClicked[data.id]
                                        ? "12px"
                                        : "8px",
                                }}
                            >
                                <Box
                                    styleSheet={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <Image
                                        onClick={() =>
                                            onImageClick(data.from, data.id)
                                        }
                                        styleSheet={{
                                            width: isImageClicked[data.id]
                                                ? "60px"
                                                : "30px",
                                            height: isImageClicked[data.id]
                                                ? "60px"
                                                : "30px",
                                            borderRadius: "50%",
                                            display: "inline-block",
                                            marginRight: "8px",
                                            transitionProperty: [
                                                "width",
                                                "height",
                                            ],
                                            cursor: "pointer",
                                            transitionDuration: "0.350s",
                                            transitionTimingFunction: "linear",
                                        }}
                                        src={`https://github.com/${data.from}.png`}
                                        className="alerts-border"
                                    />
                                    <Box
                                        styleSheet={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "start",
                                            alignItems: "start",
                                        }}
                                    >
                                        <Box
                                            styleSheet={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginBottom: "5px",
                                                marginLeft: "7px",
                                            }}
                                        >
                                            <Text tag="strong">
                                                {data.from}
                                            </Text>
                                            <Text
                                                styleSheet={{
                                                    fontSize: "10px",
                                                    marginLeft: "8px",
                                                    color: appConfig.theme
                                                        .colors.neutrals[300],
                                                }}
                                                tag="span"
                                            >
                                                {new Date().toLocaleString(
                                                    "pt-br"
                                                )}
                                            </Text>
                                        </Box>

                                        {isImageClicked[data.id] ? (
                                            <>
                                                <Text
                                                    tag="p"
                                                    styleSheet={{
                                                        fontSize: "10px",
                                                        marginLeft: "8px",
                                                        marginBottom: "3px",
                                                        color: appConfig.theme
                                                            .colors
                                                            .neutrals[300],

                                                        transitionProperty:
                                                            "opacity",
                                                        transitionDuration:
                                                            "0.400s",
                                                        transitionTimingFunction:
                                                            "linear",
                                                    }}
                                                >
                                                    {userInfo[data.from]?.bio ??
                                                        ""}
                                                </Text>
                                                <Text
                                                    tag="a"
                                                    styleSheet={{
                                                        fontSize: "10px",
                                                        marginLeft: "8px",
                                                        textDecoration:
                                                            "underline",
                                                        color: appConfig.theme
                                                            .colors
                                                            .neutrals[200],
                                                        transitionProperty:
                                                            "opacity",
                                                        transitionDuration:
                                                            "0.400s",
                                                        transitionTimingFunction:
                                                            "linear",
                                                    }}
                                                    target="_blank"
                                                    href={
                                                        userInfo[data.from]
                                                            ?.html_url ?? ""
                                                    }
                                                >
                                                    {userInfo[data.from]
                                                        ?.html_url ?? ""}
                                                </Text>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                            {data.message.startsWith(":sticker:") ? (
                                <Image
                                    src={data.message.replace(":sticker:", "")}
                                    styleSheet={{
                                        width: "120px",
                                        height: "120px",
                                        borderRadius: "10%",
                                        display: "inline-block",
                                        marginRight: "8px",
                                    }}
                                />
                            ) : (
                                data.message
                            )}
                        </Box>
                        <Text
                            onClick={(_) => {
                                deleteMessage(data.id);
                            }}
                            styleSheet={{
                                fontSize: "12px",
                                marginRight: "10px",
                                cursor: "pointer",
                            }}
                        >
                            ❌
                        </Text>
                    </Text>
                );
            })}
        </Box>
    );
}
