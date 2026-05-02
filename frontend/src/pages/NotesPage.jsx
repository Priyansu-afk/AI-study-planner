import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, FileText, Pin, MoreVertical, Link as LinkIcon, Trash2, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotesPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = "/api/notes";
  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    console.log("Fetching notes...");
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setNotes(data);
        if (data.length > 0 && !activeNote) {
          setActiveNote(data[0]);
        }
      } else {
        console.error("Fetch notes failed:", data);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    console.log("Handle Create Note clicked");
    try {
      const newNote = {
        title: "Untitled Note",
        content: "",
        isPinned: false
      };
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newNote)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log("Note created successfully:", data);
        setNotes([data, ...notes]);
        setActiveNote(data);
      } else {
        alert("Failed to create: " + (data.detail || data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error creating note:", err);
      alert("Connection error: " + err.message);
    }
  };

  const handleSaveNote = async () => {
    if (!activeNote) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/${activeNote._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(activeNote)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNotes(notes.map(n => n._id === data._id ? data : n));
      } else {
        alert("Save failed: " + (data.detail || data.message));
      }
      setIsSaving(false);
    } catch (err) {
      console.error("Error saving note:", err);
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const updatedNotes = notes.filter(n => n._id !== id);
        setNotes(updatedNotes);
        if (activeNote?._id === id) {
          setActiveNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
        }
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const togglePin = async (e, note) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/${note._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ ...note, isPinned: !note.isPinned })
      });
      const data = await response.json();
      if (response.ok) {
        setNotes(notes.map(n => n._id === data._id ? data : n));
        if (activeNote?._id === note._id) {
          setActiveNote(data);
        }
      }
    } catch (err) {
      console.error("Error pinning note:", err);
    }
  };

  const filteredNotes = notes.filter(n => 
    (n.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.content || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row gap-6 h-[calc(100vh-160px)]">
        
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-80 shrink-0 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">Your Notes</h2>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button 
            onClick={handleCreateNote}
            className="w-full py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 border-dashed rounded-lg text-sm text-primary flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {filteredNotes.map((note) => (
              <div 
                key={note._id} 
                onClick={() => setActiveNote(note)}
                className={`p-3 rounded-lg border transition-all cursor-pointer group ${
                  activeNote?._id === note._id 
                  ? "bg-primary/10 border-primary/50" 
                  : "bg-black/40 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-white mb-1 overflow-hidden">
                    <FileText className={`w-4 h-4 shrink-0 ${activeNote?._id === note._id ? "text-primary" : "text-gray-400"}`} />
                    <span className="truncate">{note.title || "Untitled Note"}</span>
                  </div>
                  <button onClick={(e) => togglePin(e, note)}>
                    <Pin className={`w-3.5 h-3.5 shrink-0 transition-colors ${note.isPinned ? "text-primary fill-primary" : "text-gray-600 hover:text-gray-400"}`} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{note.content || "No content..."}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Editor Area */}
        <AnimatePresence mode="wait">
          {activeNote ? (
            <motion.div 
              key={activeNote._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 glass-panel flex flex-col"
            >
              <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <input 
                  type="text" 
                  value={activeNote.title}
                  onChange={(e) => setActiveNote({...activeNote, title: e.target.value})}
                  className="bg-transparent border-none text-2xl font-bold text-white focus:outline-none w-full"
                  placeholder="Note Title"
                />
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <button 
                    onClick={handleSaveNote}
                    disabled={isSaving}
                    className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-primary relative group"
                    title="Save Changes"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={(e) => togglePin(e, activeNote)}
                    className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-primary"
                    title="Pin Note"
                  >
                    <Pin className={`w-4 h-4 ${activeNote.isPinned ? "text-primary fill-primary" : ""}`} />
                  </button>
                  <button 
                    onClick={() => handleDeleteNote(activeNote._id)}
                    className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-red-500"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <textarea 
                  className="w-full h-full bg-transparent border-none text-gray-300 resize-none focus:outline-none leading-relaxed text-lg"
                  value={activeNote.content}
                  onChange={(e) => setActiveNote({...activeNote, content: e.target.value})}
                  placeholder="Start writing your brilliant thoughts..."
                />
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 glass-panel flex flex-col items-center justify-center text-gray-500">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a note or create a new one to get started.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
