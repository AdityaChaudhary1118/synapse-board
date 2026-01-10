import { useEffect, useState } from "react";
import {
  TLAnyShapeUtilConstructor,
  TLStoreWithStatus,
  createTLStore,
  defaultShapeUtils,
  transact,
  TLRecord,
} from "tldraw";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import * as Y from "yjs";
import { useRoom } from "./liveblocks.config";

export function useYjsStore({
  roomId = "synapse-room",
  shapeUtils = [],
}: {
  roomId?: string;
  shapeUtils?: TLAnyShapeUtilConstructor[];
}) {
  const room = useRoom();
  const [store] = useState(() => {
    const store = createTLStore({
      shapeUtils: [...defaultShapeUtils, ...shapeUtils],
    });
    return store;
  });

  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
    status: "loading",
  });

  useEffect(() => {
    setStoreWithStatus({ status: "loading" });

    const yDoc = new Y.Doc();
    const yStore = yDoc.getMap<TLRecord>(`tl_${roomId}`);
    const provider = new LiveblocksYjsProvider(room, yDoc);

    // ---------------------------------------------------------
    // 1. INITIAL LOAD: Get existing shapes from the Cloud
    // ---------------------------------------------------------
    transact(() => {
      const updates: TLRecord[] = [];
      yStore.forEach((record) => {
        updates.push(record);
      });
      if (updates.length > 0) {
        store.put(updates);
      }
    });

    // ---------------------------------------------------------
    // 2. DOWNLOAD: Listen for changes from other users
    // ---------------------------------------------------------
    const handleChange = (events: Y.YEvent<any>[]) => {
      transact(() => {
        const toRemove: string[] = [];
        const toPut: TLRecord[] = [];

        events.forEach((event) => {
          event.changes.keys.forEach((change, key) => {
            if (change.action === "add" || change.action === "update") {
              const record = yStore.get(key);
              if (record) toPut.push(record);
            } else if (change.action === "delete") {
              toRemove.push(key);
            }
          });
        });

        store.mergeRemoteChanges(() => {
          if (toRemove.length) store.remove(toRemove as any);
          if (toPut.length) store.put(toPut);
        });
      });
    };

    yStore.observeDeep(handleChange);

    // ---------------------------------------------------------
    // 3. UPLOAD: Send my changes to the Cloud
    // ---------------------------------------------------------
    const cleanupListen = store.listen(
      ({ changes }) => {
        yDoc.transact(() => {
          Object.values(changes.added).forEach((record) => {
            yStore.set(record.id, record);
          });
          Object.values(changes.updated).forEach(([_prev, record]) => {
            yStore.set(record.id, record);
          });
          Object.values(changes.removed).forEach((record) => {
            yStore.delete(record.id);
          });
        });
      },
      { source: "user", scope: "document" } // Only sync USER changes (not remote ones)
    );

    // ---------------------------------------------------------
    // 4. READY: Tell the app we are connected
    // ---------------------------------------------------------
    const handleSync = () => {
      setStoreWithStatus({
        status: "synced-remote",
        connectionStatus: "online",
        store,
      });
    };

    if (provider.synced) handleSync();
    provider.on("sync", (isSynced: boolean) => {
      if (isSynced) handleSync();
    });

    return () => {
      yStore.unobserveDeep(handleChange);
      cleanupListen();
      provider.destroy();
    };
  }, [room, roomId, store]);

  return storeWithStatus;
}
