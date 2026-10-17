export function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`
}

export function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const STATUS_LABELS = {
  PENDING_PAYMENT: 'Awaiting payment',
  PAID: 'Paid',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}