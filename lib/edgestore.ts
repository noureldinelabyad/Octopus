'use client';
 
import { type EdgeStoreRouter } from '../app/api/edgestore/[...edgestore]/route';
import { createEdgeStoreProvider } from '@edgestore/react';
 
const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>();

  export type EdgeStoreType = {
    publicFiles: {
      delete: (params: { url: string }) => Promise<void>;
    };
  };
 
export { EdgeStoreProvider, useEdgeStore }; 

