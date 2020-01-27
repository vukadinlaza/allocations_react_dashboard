
export function nWithCommas(x) {
  if (!x) return null

  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatDate (date) {
  try {
    const d = new Date(date)
    return d.toLocaleString('en-US', { dateStyle: "short" })
  } catch (e) {
    return date
  }
}