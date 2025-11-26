import { client } from "$services/redis";
import { itemsKey, userKeysLike } from "$services/keys";
import { getItems } from "./items";

export const userLikesItem = async (itemId: string, userId: string) => {
    return client.sIsMember(userKeysLike(userId), itemId);
};

export const likedItems = async (userId: string) => {
    const ids = await client.sMembers(userKeysLike(userId));

    return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
    const inserted = await client.sAdd(userKeysLike(userId), itemId);

    if (inserted) {
        return client.hIncrBy(itemsKey(itemId), 'likes', 1);
    }
};

export const unlikeItem = async (itemId: string, userId: string) => {
    const removed = await client.sRem(userKeysLike(userId), itemId);

    if (removed) {
        return client.hIncrBy(itemsKey(itemId), 'likes', -1);
    }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
    const ids = await client.sInter([userKeysLike(userOneId), userKeysLike(userTwoId)]);

    return getItems(ids);
};
