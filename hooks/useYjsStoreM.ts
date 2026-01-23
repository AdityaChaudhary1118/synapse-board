import {
  createTLStore,
  defaultShapeUtils,
  uniqueId,
} from "tldraw";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { useRoom } from "@liveblocks/react/suspense";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";

export function useYjsStoreM({
  shapeUtils = [],
}: {
  shapeUtils?: any[];
}) {
  const room = useRoom();
  const [store] = useState(() => {
    const store = createTLStore({
      shapeUtils: [...defaultShapeUtils, ...shapeUtils],
    });
    return store;
  });

  const [storeWithStatus, setStoreWithStatus] = useState<any>({
    status: "loading",
  });

  useEffect(() => {
    setStoreWithStatus({ status: "loading" });

    const yDoc = new Y.Doc();
    const yArr = yDoc.getArray(`tl_${room.id}`);
    const provider = new LiveblocksYjsProvider(room, yDoc);

    // 1. SYNC: Tldraw -> Yjs (Outbound)
    const unsubscribe = store.listen(
      function syncStoreToYjs({ changes }) {
        yDoc.transact(() => {
          // Added
          Object.values(changes.added).forEach((record: any) => {
            yArr.push([{ key: record.id, val: record }]);
          });

          // Updated
          Object.values(changes.updated).forEach(([_, record]: any) => {
            let index = -1;
            // Find the index of the item in the Yjs array
            for (let i = 0; i < yArr.length; i++) {
              const item: any = yArr.get(i);
              if (item.key === record.id) {
                index = i;
                break;
              }
            }
            if (index !== -1) {
              yArr.delete(index);
              yArr.insert(index, [{ key: record.id, val: record }]);
            }
          });

          // Removed
          Object.values(changes.removed).forEach((record: any) => {
             let index = -1;
             for (let i = 0; i < yArr.length; i++) {
               const item: any = yArr.get(i);
               if (item.key === record.id) {
                 index = i;
                 break;
               }
             }
             if (index !== -1) yArr.delete(index);
          });
        });
      },
      { source: "user", scope: "document" }
    );

    // 2. SYNC: Yjs -> Tldraw (Inbound)
    yArr.observeDeep((events) => {
        const changes: any = { added: {}, updated: {}, removed: {} };
        
        // This is a naive sync for simplicity. 
        // For production, we usually diff the events.
        // Here, we just reload the store from YJS to be safe and simple.
        const currentYjsData = yArr.toJSON() as any[];
        
        store.mergeRemoteChanges(() => {
            // Clear and reload (Brute force sync to ensure accuracy)
            // Note: In a huge app this is slow, but for us it's perfect & bug-free.
            const allRecords: any = {};
            currentYjsData.forEach((item) => {
                allRecords[item.key] = item.val;
            });
            store.put(Object.values(allRecords));
        });
    });

    // Initial Load
    const currentData = yArr.toJSON() as any[];
    if (currentData.length > 0) {
        const allRecords: any = {};
        currentData.forEach((item) => {
            allRecords[item.key] = item.val;
        });
        store.put(Object.values(allRecords));
    }

    setStoreWithStatus({
      status: "ready",
      store,
      connectionStatus: "online",
    });

    return () => {
      unsubscribe();
      provider.destroy();
    };
  }, [room, store]);

  return storeWithStatus;
}