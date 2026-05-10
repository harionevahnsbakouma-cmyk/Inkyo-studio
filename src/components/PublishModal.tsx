import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ImagePlus, FileText, Tag, Globe, Lock, ChevronDown, FolderUp, Trash2, GripVertical, CheckCircle2, Camera, Smartphone } from 'lucide-react';
import { useStore } from '../store/useStore';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
}

export default function PublishModal() {
  const { showPublishModal, setShowPublishModal } = useStore();
  const [step, setStep] = useState(1);
  const [bulkMode, setBulkMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Real file state
  const [coverFile, setCoverFile] = useState<UploadedFile | null>(null);
  const [pageFiles, setPageFiles] = useState<UploadedFile[]>([]);
  const [dragOverCover, setDragOverCover] = useState(false);
  const [dragOverPages, setDragOverPages] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const pagesInputRef = useRef<HTMLInputElement>(null);

  // Helpers
  const createUploadedFile = (file: File): UploadedFile => ({
    id: crypto.randomUUID(),
    file,
    preview: URL.createObjectURL(file),
  });

  const handleCoverSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    if (coverFile) URL.revokeObjectURL(coverFile.preview);
    setCoverFile(createUploadedFile(file));
  }, [coverFile]);

  const handlePagesSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newFiles.push(createUploadedFile(file));
      }
    }
    setPageFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removePage = (id: string) => {
    setPageFiles(prev => {
      const target = prev.find(p => p.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(p => p.id !== id);
    });
  };

  const removeCover = () => {
    if (coverFile) URL.revokeObjectURL(coverFile.preview);
    setCoverFile(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'cover' | 'pages') => {
    e.preventDefault();
    setDragOverCover(false);
    setDragOverPages(false);
    const files = e.dataTransfer.files;
    if (type === 'cover') handleCoverSelect(files);
    else handlePagesSelect(files);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return p + 2;
      });
    }, 50);
  };

  const resetAll = () => {
    setStep(1);
    if (coverFile) URL.revokeObjectURL(coverFile.preview);
    pageFiles.forEach(p => URL.revokeObjectURL(p.preview));
    setCoverFile(null);
    setPageFiles([]);
    setUploadProgress(0);
    setIsUploading(false);
    setBulkMode(false);
  };

  const handleClose = () => {
    setShowPublishModal(false);
    resetAll();
  };

  if (!showPublishModal) return null;

  const totalImages = (coverFile ? 1 : 0) + pageFiles.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ type: 'spring', damping: 28, stiffness: 340 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 pb-4 border-b border-ink-border/30 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-crimson/15 flex items-center justify-center">
                  <Upload className="w-4.5 h-4.5 text-crimson" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-ink-white">Publier votre œuvre</h2>
                  <p className="text-xs text-ink-muted">Importez vos images depuis votre appareil</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-ink-border/20 text-ink-muted hover:text-ink-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-1">
              {[
                { n: 1, label: 'Infos' },
                { n: 2, label: 'Images' },
                { n: 3, label: 'Terminé' },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-1 flex-1">
                  <button
                    onClick={() => step > s.n && setStep(s.n)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all w-full justify-center ${
                      step === s.n
                        ? 'bg-crimson text-white shadow-md shadow-crimson/20'
                        : step > s.n
                          ? 'bg-crimson/15 text-crimson cursor-pointer hover:bg-crimson/25'
                          : 'bg-ink-dark/60 text-ink-muted'
                    }`}
                  >
                    {step > s.n ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">{s.n}</span>}
                    {s.label}
                  </button>
                  {i < 2 && <div className={`w-4 h-0.5 rounded shrink-0 ${step > s.n ? 'bg-crimson' : 'bg-ink-border/30'}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="p-5 overflow-y-auto flex-1">
            {/* ===== STEP 1: Infos ===== */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-ink-text mb-1.5 block">Titre de l'œuvre *</label>
                  <input type="text" placeholder="Ex: Chroniques de l'Ombre" className="w-full bg-ink-dark border border-ink-border/50 rounded-xl px-4 py-3 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink-text mb-1.5 block">Description</label>
                  <textarea rows={3} placeholder="Racontez votre histoire en quelques lignes..." className="w-full bg-ink-dark border border-ink-border/50 rounded-xl px-4 py-3 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 resize-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-ink-text mb-1.5 block">Genre</label>
                    <div className="relative">
                      <select className="w-full bg-ink-dark border border-ink-border/50 rounded-xl px-4 py-3 text-sm text-ink-text appearance-none focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20">
                        <option>Action</option>
                        <option>Romance</option>
                        <option>Sci-Fi</option>
                        <option>Fantasy</option>
                        <option>Horreur</option>
                        <option>Thriller</option>
                        <option>Comédie</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink-text mb-1.5 block">Visibilité</label>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1 py-3 bg-crimson/15 border border-crimson/40 text-crimson rounded-xl text-sm font-medium">
                        <Globe className="w-3.5 h-3.5" /> Public
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 py-3 bg-ink-dark border border-ink-border/50 text-ink-muted rounded-xl text-sm hover:border-ink-border transition-colors">
                        <Lock className="w-3.5 h-3.5" /> Privé
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-ink-text mb-1.5 block">Tags</label>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-ink-muted shrink-0" />
                    <input type="text" placeholder="Action, Fantasy, Shonen..." className="flex-1 bg-ink-dark border border-ink-border/50 rounded-xl px-4 py-2.5 text-sm text-ink-text placeholder:text-ink-muted focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 transition-all" />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-3 bg-crimson hover:bg-crimson-dark text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-crimson/20 active:scale-[0.98]">
                  Suivant : Importer les images →
                </button>
              </motion.div>
            )}

            {/* ===== STEP 2: Upload images ===== */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Bulk Toggle */}
                <div className="flex items-center justify-between p-3 bg-ink-dark rounded-xl border border-ink-border/30">
                  <div className="flex items-center gap-2.5">
                    <FolderUp className="w-4 h-4 text-gold" />
                    <div>
                      <p className="text-sm font-medium text-ink-text">Bulk Upload</p>
                      <p className="text-[11px] text-ink-muted">Séries de 1000+ épisodes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setBulkMode(!bulkMode)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${bulkMode ? 'bg-crimson' : 'bg-ink-border/60'}`}
                  >
                    <motion.div
                      animate={{ x: bulkMode ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                    />
                  </button>
                </div>

                {/* ---- COVER UPLOAD ---- */}
                <div>
                  <label className="text-sm font-medium text-ink-text mb-1.5 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-crimson" />
                    Couverture de l'œuvre *
                  </label>

                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCoverSelect(e.target.files)}
                  />

                  {coverFile ? (
                    <div className="relative group rounded-xl overflow-hidden border border-ink-border/40">
                      <img src={coverFile.preview} alt="Couverture" className="w-full h-52 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => coverInputRef.current?.click()}
                          className="px-3 py-2 bg-ink-card/90 rounded-lg text-xs font-semibold text-ink-white hover:bg-ink-card transition-colors"
                        >
                          Changer
                        </button>
                        <button
                          onClick={removeCover}
                          className="px-3 py-2 bg-crimson/90 rounded-lg text-xs font-semibold text-white hover:bg-crimson transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md">
                        <p className="text-[10px] text-ink-white font-medium truncate max-w-[200px]">{coverFile.file.name}</p>
                        <p className="text-[9px] text-ink-muted">{(coverFile.file.size / 1024).toFixed(0)} Ko</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => coverInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragOverCover(true); }}
                      onDragLeave={() => setDragOverCover(false)}
                      onDrop={(e) => handleDrop(e, 'cover')}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        dragOverCover
                          ? 'border-crimson bg-crimson/5 scale-[1.01]'
                          : 'border-ink-border/40 hover:border-crimson/50 hover:bg-crimson/5'
                      }`}
                    >
                      <ImagePlus className="w-10 h-10 text-ink-muted mx-auto mb-3" />
                      <p className="text-sm text-ink-text font-medium">Touchez pour importer la couverture</p>
                      <p className="text-xs text-ink-muted mt-1 flex items-center justify-center gap-1">
                        <Smartphone className="w-3 h-3" /> Depuis votre appareil · PNG, JPG, WebP
                      </p>
                    </div>
                  )}
                </div>

                {/* ---- PAGES UPLOAD ---- */}
                <div>
                  <label className="text-sm font-medium text-ink-text mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-eumene" />
                      {bulkMode ? 'Images des épisodes' : 'Pages du premier épisode'}
                    </span>
                    {pageFiles.length > 0 && (
                      <span className="text-xs text-eumene font-semibold">{pageFiles.length} image{pageFiles.length > 1 ? 's' : ''}</span>
                    )}
                  </label>

                  <input
                    ref={pagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handlePagesSelect(e.target.files)}
                  />

                  {/* Drop zone / Add more */}
                  <div
                    onClick={() => pagesInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOverPages(true); }}
                    onDragLeave={() => setDragOverPages(false)}
                    onDrop={(e) => handleDrop(e, 'pages')}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      dragOverPages
                        ? 'border-eumene bg-eumene/5 scale-[1.01]'
                        : 'border-ink-border/40 hover:border-eumene/50 hover:bg-eumene/5'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-ink-muted mx-auto mb-2" />
                    <p className="text-sm text-ink-text font-medium">
                      {pageFiles.length > 0 ? 'Ajouter d\'autres images' : 'Touchez pour importer les pages'}
                    </p>
                    <p className="text-xs text-ink-muted mt-1 flex items-center justify-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      {bulkMode ? 'Sélection multiple · Jusqu\'à 1000+ images' : 'Sélection multiple · PNG, JPG, WebP'}
                    </p>
                  </div>

                  {/* Thumbnails grid */}
                  {pageFiles.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-52 overflow-y-auto hide-scrollbar rounded-lg">
                      {pageFiles.map((pf, idx) => (
                        <motion.div
                          key={pf.id}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.02 }}
                          className="relative group aspect-3/4 rounded-lg overflow-hidden border border-ink-border/30"
                        >
                          <img src={pf.preview} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                          {/* Page number */}
                          <div className="absolute top-1 left-1 w-5 h-5 rounded bg-black/70 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-white">{idx + 1}</span>
                          </div>
                          {/* Delete */}
                          <button
                            onClick={(e) => { e.stopPropagation(); removePage(pf.id); }}
                            className="absolute top-1 right-1 w-5 h-5 rounded bg-crimson/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                          {/* Grip */}
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-70 transition-opacity">
                            <GripVertical className="w-3 h-3 text-white" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {bulkMode && (
                  <div className="p-3 bg-gold/10 border border-gold/30 rounded-xl flex items-start gap-2">
                    <span className="text-sm">💡</span>
                    <p className="text-xs text-gold">Astuce : Sélectionnez toutes les images d'un coup depuis votre galerie. Elles seront triées par nom automatiquement.</p>
                  </div>
                )}

                {/* Upload progress */}
                {isUploading && (
                  <div className="p-3 bg-ink-dark rounded-xl border border-ink-border/30">
                    <div className="flex justify-between text-xs text-ink-muted mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
                        Upload en cours... {totalImages} image{totalImages > 1 ? 's' : ''}
                      </span>
                      <span className="font-semibold text-ink-text">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-ink-black rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-linear-to-r from-crimson to-crimson-glow rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 bg-ink-dark border border-ink-border/50 text-ink-text font-semibold rounded-xl hover:bg-ink-card transition-colors active:scale-[0.98]">
                    ← Retour
                  </button>
                  <button
                    onClick={() => { simulateUpload(); setTimeout(() => setStep(3), 3000); }}
                    disabled={!coverFile && pageFiles.length === 0}
                    className={`flex-1 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                      coverFile || pageFiles.length > 0
                        ? 'bg-crimson hover:bg-crimson-dark text-white hover:shadow-lg hover:shadow-crimson/20'
                        : 'bg-ink-dark text-ink-muted cursor-not-allowed'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    Publier {totalImages > 0 ? `(${totalImages})` : ''}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 3: Success ===== */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="w-20 h-20 rounded-2xl bg-eumene/15 flex items-center justify-center mx-auto mb-5"
                >
                  <span className="text-4xl">🎉</span>
                </motion.div>
                <h3 className="text-xl font-bold text-ink-white mb-2">Publication réussie !</h3>
                <p className="text-sm text-ink-muted mb-2">
                  Votre œuvre est maintenant visible par la communauté Inkyo.
                </p>
                {(coverFile || pageFiles.length > 0) && (
                  <p className="text-xs text-eumene mb-6">
                    {totalImages} image{totalImages > 1 ? 's' : ''} importée{totalImages > 1 ? 's' : ''} avec succès
                  </p>
                )}

                {/* Preview of uploaded */}
                {(coverFile || pageFiles.length > 0) && (
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {coverFile && (
                      <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-eumene/40 shadow-lg shadow-eumene/10">
                        <img src={coverFile.preview} alt="Cover" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {pageFiles.slice(0, 4).map((pf, i) => (
                      <div key={pf.id} className="w-12 h-16 rounded-lg overflow-hidden border border-ink-border/40 opacity-80">
                        <img src={pf.preview} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {pageFiles.length > 4 && (
                      <div className="w-12 h-16 rounded-lg bg-ink-dark border border-ink-border/40 flex items-center justify-center">
                        <span className="text-xs text-ink-muted font-semibold">+{pageFiles.length - 4}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={handleClose} className="flex-1 py-3 bg-ink-dark border border-ink-border/50 text-ink-text rounded-xl font-semibold hover:bg-ink-card transition-colors">
                    Fermer
                  </button>
                  <button onClick={handleClose} className="flex-1 py-3 bg-crimson hover:bg-crimson-dark text-white rounded-xl font-semibold transition-all">
                    Voir ma page
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
