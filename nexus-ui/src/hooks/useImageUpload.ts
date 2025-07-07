// src/hooks/useImageUpload.ts
import { useState, useCallback } from "react";

type LocalImage = {
  preview: string;   // blob: URL for instant thumbnail
  file: File;        // original file (to upload later)
};
type RemoteUrl = string;

export const useImageUpload = (initialUrls: RemoteUrl[] = []) => {
  /** 🔸 We keep two separate buckets */
  const [remoteUrls, setRemoteUrls]   = useState<RemoteUrl[]>(initialUrls); // already on server
  const [localImgs,  setLocalImgs]    = useState<LocalImage[]>([]);         // new, not uploaded

  const allImages = [...remoteUrls, ...localImgs.map(l => l.preview)]; // for <ImageDisplay/>

  /* --- UI helpers stay almost identical --- */
  const [selected, setSelected] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = useCallback((files: FileList) => {
    const arr = Array.from(files);
    const locals = arr.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setLocalImgs(prev => [...prev, ...locals]);
  }, []);

  const removeImage = useCallback((index: number) => {
    /** 🔸 Decide if we’re removing an existing url or a local file */
    if (index < remoteUrls.length) {
      setRemoteUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      const localIdx = index - remoteUrls.length;
      setLocalImgs(prev => prev.filter((_, i) => i !== localIdx));
    }
    if (selected >= index && selected > 0) setSelected(i => i - 1);
  }, [remoteUrls.length, selected]);

  /* --- drag/drop helpers stay unchanged --- */
  const handleDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(true); },[]);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false);},[]);
  const handleDrop      = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); handleImageUpload(e.dataTransfer.files);},[handleImageUpload]);

  /** 🔸 NEW: uploadPendingImages, called from “Save” */
  const uploadPendingImages = useCallback(async (): Promise<RemoteUrl[]> => {
    if (!localImgs.length) return remoteUrls;               // nothing new

    const formDataList = localImgs.map(l => {
      const f = new FormData();
      f.append("image", l.file);
      return f;
    });

    const uploaded: RemoteUrl[] = [];
    for (const fd of formDataList) {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const { url } = await res.json();
      uploaded.push(url);
    }

    // merge & flush locals
    setRemoteUrls(prev => [...prev, ...uploaded]);
    setLocalImgs([]);
    return [...remoteUrls, ...uploaded];
  }, [localImgs, remoteUrls]);

  return {
    images: allImages,              // for <ImageDisplay/>
    selectedImageIndex: selected,
    dragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleImageUpload,
    removeImage,
    selectImage: setSelected,
    /** 🔸 expose for ProductDetailPage */
    uploadPendingImages,
  };
};