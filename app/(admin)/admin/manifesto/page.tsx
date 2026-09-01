"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, FileText, CheckCircle, ExternalLink, Download, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface DocumentInfo {
  id?: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size?: string;
  version?: string;
  updated_at?: string;
}

export default function AdminManifestoPage() {
  const [doc, setDoc] = useState<DocumentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState("A New Direction for Edo North — Full Manifesto");
  const [version, setVersion] = useState("2026 Official Policy Edition");
  const [directUrl, setDirectUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocument();
  }, []);

  async function loadDocument() {
    setLoading(true);
    try {
      const res = await fetch("/api/manifesto/upload");
      const data = await res.json();
      if (data.success && data.data) {
        setDoc(data.data);
        setTitle(data.data.title || "A New Direction for Edo North — Full Manifesto");
        setVersion(data.data.version || "2026 Official Policy Edition");
        setDirectUrl(data.data.file_url || "");
      }
    } catch (err) {
      toast.error("Failed to load current manifesto info");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        toast.error("Please select a valid PDF file");
        return;
      }
      setSelectedFile(file);
      toast.success(`Selected "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a PDF file to upload");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      if (directUrl) {
        formData.append("url", directUrl);
      }
      formData.append("title", title);
      formData.append("version", version);

      const res = await fetch("/api/manifesto/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Manifesto PDF uploaded and published successfully!");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        loadDocument();
      } else {
        toast.error("Upload error: " + (result.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Failed to upload: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-[10.5px] tracking-widest uppercase text-orange block mb-1">
            Official Documents
          </span>
          <h1 className="font-display font-semibold text-[clamp(21px,2.6vw,27px)]">
            Campaign Manifesto (PDF)
          </h1>
          <p className="text-[13.5px] text-slate mt-1">
            Upload and update the official campaign manifesto PDF file that visitors download across the website.
          </p>
        </div>

        <button
          onClick={loadDocument}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-ink/15 text-slate rounded-site font-semibold text-[12.5px] hover:border-orange hover:text-orange transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>



      {/* Upload New Version Form */}
      <div className="bg-white border border-ink/10 rounded-site p-6">
        <h3 className="font-display font-semibold text-[18px] text-ink mb-1">
          Upload New Manifesto PDF
        </h3>
        <p className="text-[13px] text-slate mb-6">
          Uploading a new PDF replaces the previous file and instantly updates all download buttons on the site.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Drag and Drop Box */}
          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-2">
              Select PDF File (.pdf)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-site p-8 text-center cursor-pointer transition-all ${
                selectedFile
                  ? "border-orange bg-orange/5"
                  : "border-ink/20 hover:border-orange hover:bg-paper/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className={`w-8 h-8 mx-auto mb-2.5 ${selectedFile ? "text-orange" : "text-slate/60"}`} />
              {selectedFile ? (
                <div>
                  <span className="font-semibold text-[14px] text-ink block mb-0.5">
                    {selectedFile.name}
                  </span>
                  <span className="font-mono text-[11px] text-orange">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready to upload
                  </span>
                </div>
              ) : (
                <div>
                  <span className="font-semibold text-[14px] text-ink block mb-1">
                    Click to browse or drop your PDF here
                  </span>
                  <span className="text-[12px] text-slate font-mono">
                    Supports PDF documents up to 50MB
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. A New Direction for Edo North — Full Manifesto"
                className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
              />
            </div>

            <div>
              <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                Version / Edition Note
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. 2026 Official Policy Document"
                className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
              />
            </div>

          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white rounded-site font-semibold text-[13.5px] hover:bg-orange-dark shadow-sm transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading &amp; Publishing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Save &amp; Publish Manifesto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
