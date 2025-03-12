export const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    
    // Formattazione manuale della data in italiano
    const giorno = date.getDate().toString().padStart(2, '0');
    const mesi = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
    const mese = mesi[date.getMonth()];
    const anno = date.getFullYear();
    const ore = date.getHours().toString().padStart(2, '0');
    const minuti = date.getMinutes().toString().padStart(2, '0');
    
    return `${giorno} ${mese} ${anno}, ${ore}:${minuti}`;
  };
