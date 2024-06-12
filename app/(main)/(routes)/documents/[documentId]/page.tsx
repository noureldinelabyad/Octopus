"use client"
import React, { Component, ElementRef, PropsWithChildren, useRef, useState } from 'react';

import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
// import { Editor } from "@/components/editor";    commented after i export it by defult and used .... insted  and imported what is below 
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Navbar } from '@/app/(main)/_components/navbar';
import { useMediaQuery } from 'usehooks-ts';
import { Title } from '@/app/(main)/_components/title';

import Tiptap from "@/components/tiptap";
import { ChildDocumentGrid } from '@/components/document-list';



interface DocumentIdPageProps {
    params: {
        documentId: Id<"documents">;
    };
};

class ErrorBoundary extends Component<PropsWithChildren<{}>, { hasError: boolean }> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong with the Editor.</h1>;
    }

    return this.props.children;
  }
}

const DocumentIdPage = ({
    params
}: DocumentIdPageProps) => {
  //const Editor = useMemo(() => dynamic(() => import("@/editor"),{ssr: false}), []);
  const Tiptap = useMemo(() => dynamic(() => import("@/components/tiptap"),{ssr: false}), []);

 // const Editor = dynamic(() => import("@/components/editor"),{ssr: false});

  const navbarRef = useRef<HTMLDivElement>(null); // Ensure this is at the top level, not conditional
  const isMobile = useMediaQuery('(max-width: 768px)'); // Ensure this is at the top level, not conditional

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  });

  const update = useMutation(api.documents.update);

  const [editorContent, setEditorContent] = useState(document?.content || '');

  
  const onChange = (content: string) => {
    setEditorContent(content);
    update({
      id: params.documentId,
      content
    });
    console.log(content);
  };

  const onContentChange = (content: string) => {
    setEditorContent(content);
    update({
      id: params.documentId,
      content
    });
    console.log(content);
  };

  // Ensure all hooks are above any conditions or early returns
  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:mx-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4" >
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  const resetWidth = () => {
    if (navbarRef.current) {
      navbarRef.current.style.width = isMobile ? '100%' : '240px';
      navbarRef.current.style.left = isMobile ? '0' : '240px';
    }
  };
    
  return (
    <div className="pb-40 dark:bg-[#1F1F1F]">
      <Navbar isCollapsed={false} onResetWidth={resetWidth}/>
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />

        {/* <p
          className="text-xl text-muted-foreground"
        >
          Pages in your {document.title}&apos;s workspace
         </p>
        <ChildDocumentGrid
        
        /> */}

        <ErrorBoundary>
          {/* <Editor
            onChange={onChange}
            initialContent={document.content}
          />  */}
        <Tiptap
          onContentChange={onContentChange}
          initialContent={document.content}
        />

        </ErrorBoundary>
      </div>
    </div>
  );
}
 
export default DocumentIdPage;

