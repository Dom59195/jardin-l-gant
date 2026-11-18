/** Détecte si une URL de média pointe vers une vidéo (selon l'extension). */
export function estVideo(url: string): boolean {
  return /\.(mp4|webm|mov|m4v|ogg|ogv)(\?|#|$)/i.test(url);
}
