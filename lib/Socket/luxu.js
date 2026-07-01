"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SirobailLuxu = void 0;

const { proto } = require("../../WAProto/index.js");
const crypto = require("crypto");

// SIROBAIL: luxu — handler pesan spesial (payment, product, album, event, pollResult, order, groupStory, groupLabel)
class SirobailLuxu {
    constructor(Utils, waUploadToServer, relayMessage) {
        this.Utils = Utils;
        this.waUploadToServer = waUploadToServer;
        this.relayMessage = relayMessage;
    }

    detectType(content) {
        if (content.requestPaymentMessage) return "PAYMENT";
        if (content.productMessage) return "PRODUCT";
        if (content.albumMessage) return "ALBUM";
        if (content.eventMessage) return "EVENT";
        if (content.pollResultMessage) return "POLL_RESULT";
        if (content.orderMessage) return "ORDER";
        if (content.groupStatus) return "GROUP_STATUS";
        if (content.groupLabel) return "GROUP_LABEL";
        return null;
    }

    async handlePayment(content, jid, quoted) {
        const data = content.requestPaymentMessage;
        let noteMessage = {};

        if (data.sticker?.stickerMessage) {
            noteMessage = {
                stickerMessage: {
                    ...data.sticker.stickerMessage,
                    contextInfo: {
                        stanzaId: quoted?.key?.id,
                        participant: quoted?.key?.participant,
                        quotedMessage: quoted?.message
                    }
                }
            };
        } else if (data.note) {
            noteMessage = {
                extendedTextMessage: {
                    text: data.note,
                    contextInfo: {
                        stanzaId: quoted?.key?.id,
                        participant: quoted?.key?.participant,
                        quotedMessage: quoted?.message
                    }
                }
            };
        }

        const msg = this.Utils.generateWAMessageFromContent(jid, {
            requestPaymentMessage: proto.Message.RequestPaymentMessage.fromObject({
                expiryTimestamp: data.expiry || 0,
                amount1000: data.amount || 0,
                currencyCodeIso4217: data.currency || "IDR",
                requestFrom: data.from || "0@s.whatsapp.net",
                noteMessage,
                background: data.background ?? {
                    id: "DEFAULT",
                    placeholderArgb: 0xFFF0F0F0
                }
            })
        }, { quoted });

        await this.relayMessage(jid, msg.message, { messageId: msg.key.id });
        return msg;
    }

    async handleProduct(content, jid, quoted) {
        const {
            title,
            description,
            thumbnail,
            productId,
            retailerId,
            url,
            body = "",
            footer = "",
            buttons = [],
            priceAmount1000 = null,
            currencyCode = "IDR"
        } = content.productMessage;

        let productImage;

        if (Buffer.isBuffer(thumbnail)) {
            const { imageMessage } = await this.Utils.generateWAMessageContent(
                { image: thumbnail },
                { upload: this.waUploadToServer }
            );
            productImage = imageMessage;
        } else if (typeof thumbnail === "object" && thumbnail?.url) {
            const { imageMessage } = await this.Utils.generateWAMessageContent(
                { image: { url: thumbnail.url } },
                { upload: this.waUploadToServer }
            );
            productImage = imageMessage;
        }

        const msg = this.Utils.generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: body },
                        footer: { text: footer },
                        header: {
                            title,
                            hasMediaAttachment: true,
                            productMessage: {
                                product: {
                                    productImage,
                                    productId,
                                    title,
                                    description,
                                    currencyCode,
                                    priceAmount1000,
                                    retailerId,
                                    url,
                                    productImageCount: 1
                                },
                                businessOwnerJid: "0@s.whatsapp.net"
                            }
                        },
                        nativeFlowMessage: { buttons }
                    }
                }
            }
        }, { quoted });

        await this.relayMessage(jid, msg.message, { messageId: msg.key.id });
        return msg;
    }

    async handleAlbum(content, jid, quoted) {
        const array = content.albumMessage;

        const album = await this.Utils.generateWAMessageFromContent(jid, {
            messageContextInfo: {
                messageSecret: crypto.randomBytes(32)
            },
            albumMessage: {
                expectedImageCount: array.filter(a => a.hasOwnProperty("image")).length,
                expectedVideoCount: array.filter(a => a.hasOwnProperty("video")).length
            }
        }, { quoted });

        await this.relayMessage(jid, album.message, { messageId: album.key.id });

        for (const item of array) {
            const img = await this.Utils.generateWAMessage(jid, item, {
                upload: this.waUploadToServer,
                messageId: this.Utils.generateMessageID()
            });

            img.message.messageContextInfo = {
                messageSecret: crypto.randomBytes(32),
                messageAssociation: {
                    associationType: 1,
                    parentMessageKey: album.key
                }
            };

            await this.relayMessage(jid, img.message, { messageId: img.key.id });
        }

        return album;
    }

    async handleEvent(content, jid, quoted) {
        const eventData = content.eventMessage;

        const msg = this.Utils.generateWAMessageFromContent(jid, {
            eventMessage: {
                isCanceled: eventData.isCanceled || false,
                name: eventData.name,
                description: eventData.description,
                location: eventData.location || {
                    degreesLatitude: 0,
                    degreesLongitude: 0,
                    name: "Location"
                },
                joinLink: eventData.joinLink || "",
                startTime: typeof eventData.startTime === "string"
                    ? parseInt(eventData.startTime)
                    : eventData.startTime || Date.now(),
                endTime: typeof eventData.endTime === "string"
                    ? parseInt(eventData.endTime)
                    : eventData.endTime || Date.now() + 3600000,
                extraGuestsAllowed: eventData.extraGuestsAllowed !== false
            }
        }, { quoted });

        await this.relayMessage(jid, msg.message, {
            messageId: msg.key.id,
            additionalNodes: [{ tag: "meta", attrs: { event_type: "creation" } }]
        });
        return msg;
    }

    async handlePollResult(content, jid, quoted) {
        const pollData = content.pollResultMessage;

        const msg = this.Utils.generateWAMessageFromContent(jid, {
            pollResultSnapshotMessage: {
                name: pollData.name,
                pollVotes: pollData.pollVotes.map(vote => ({
                    optionName: vote.optionName,
                    optionVoteCount: typeof vote.optionVoteCount === "number"
                        ? vote.optionVoteCount.toString()
                        : vote.optionVoteCount
                }))
            }
        }, { quoted });

        await this.relayMessage(jid, msg.message, { messageId: msg.key.id });
        return msg;
    }

    async handleOrderMessage(content, jid, quoted) {
        const orderData = content.orderMessage;

        const msg = this.Utils.generateWAMessageFromContent(jid, {
            orderMessage: {
                orderId: orderData.orderId || "SIROBAIL_ORDER",
                thumbnail: orderData.thumbnail || null,
                itemCount: orderData.itemCount || 0,
                status: "ACCEPTED",
                surface: "CATALOG",
                message: orderData.message,
                orderTitle: orderData.orderTitle,
                sellerJid: "0@whatsapp.net",
                token: orderData.token || "SIROBAIL_TOKEN",
                totalAmount1000: orderData.totalAmount1000 || 0,
                totalCurrencyCode: orderData.totalCurrencyCode || "IDR",
                messageVersion: 2
            }
        }, { quoted });

        await this.relayMessage(jid, msg.message, { messageId: msg.key.id });
        return msg;
    }

    async handleGroupStory(content, jid, quoted) {
        const storyData = content.groupStatus;

        const messageContent = await this.Utils.generateWAMessageContent(storyData, {
            upload: this.waUploadToServer
        });

        const msg = this.Utils.generateWAMessageFromContent(jid, {
            groupStatusMessageV2: {
                message: messageContent
            }
        }, { quoted });

        await this.relayMessage(jid, msg.message, { messageId: msg.key.id });
        return msg;
    }

    async handleGbLabel(content, jid) {
        const x = content.groupLabel;
        if (!jid.endsWith("@g.us")) {
            throw new Error("groupLabel hanya bisa dipakai di grup (@g.us)");
        }

        const msg = this.Utils.generateWAMessageFromContent(jid, {
            protocolMessage: {
                type: "GROUP_MEMBER_LABEL_CHANGE",
                memberLabel: {
                    label: x.labelText.slice(0, 30)
                }
            }
        }, {});

        await this.relayMessage(jid, msg.message, {
            messageId: msg.key.id,
            additionalNodes: [{
                tag: "meta",
                attrs: { tag_reason: "user_update", appdata: "member_tag" }
            }]
        });
        return msg;
    }
}

exports.SirobailLuxu = SirobailLuxu;