interface ChipStyle {
  fontSize: string;
  fontWeight: number;
  borderRadius: string;
  height: string;
  background?: string;
  color?: string;
}

export const sortByStatus = (data: any, field?: string, order?: string) => {
  const statusOrder: { [key: string]: any } = {
    invited: 0,
    viewed: 1,
    signed: 2,
    wired: 3,
    complete: 4,
  };
  return data.sort((a: any, b: any) => {
    return order === 'desc'
      ? statusOrder[field ? a[field] : a] - statusOrder[field ? b[field] : b]
      : statusOrder[field ? b[field] : b] - statusOrder[field ? a[field] : a];
  });
};

export const getChipStyle = (status: string) => {
  const basicStyle: ChipStyle = {
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: '12px',
    height: '24px',
  };
  switch (status) {
    case 'invited':
      basicStyle.background = '#F1F5F9';
      basicStyle.color = '#334155';
      return basicStyle;
    case 'viewed':
      basicStyle.background = '#2A2B54';
      basicStyle.color = '#FFFFFF';
      return basicStyle;
    case 'signed':
      basicStyle.background = '#ECF3FF';
      basicStyle.color = '#0558E7';
      return basicStyle;
    case 'wired':
      basicStyle.background = '#D1FAE5';
      basicStyle.color = '#047857';
      return basicStyle;
    case 'complete':
      basicStyle.background = '#D1FAE5';
      basicStyle.color = '#047857';
      return basicStyle;
    default:
      return basicStyle;
  }
};
