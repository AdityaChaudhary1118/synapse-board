import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: "pk_dev_SpAHt3j-FkAro0WYNDVlhfPBQPCER1i_cdJ_6F0lFJFDESenGkvshtOilAo8Rj34",
});

export const { RoomProvider, useRoom, useMyPresence, useOthers, useSelf } =
  createRoomContext(client);
