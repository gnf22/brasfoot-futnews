export const normalizeTeamName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[áãâ]/g, 'a')
      .replace(/[éê]/g, 'e')
      .replace(/[í]/g, 'i')
      .replace(/[óô]/g, 'o')
      .replace(/[ú]/g, 'u');
  };