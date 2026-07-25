/* ============================================================
   CartShare — Receipt Generation
   Build receipt data, render modal, trigger print
   ============================================================ */

const CartShareReceipt = (() => {

  /**
   * Generate receipt data from room state
   */
  function generateReceipt(room) {
    if (!room) return null;

    const items = room.items || [];
    const itemRows = items.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: (item.price || 0) * (item.quantity || 0),
      addedBy: item.addedBy
    }));

    // Sort by name
    itemRows.sort((a, b) => a.name.localeCompare(b.name));

    const subtotal = itemRows.reduce((sum, row) => sum + row.total, 0);
    const totalItems = itemRows.reduce((sum, row) => sum + row.quantity, 0);

    return {
      roomId: room.roomId,
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      participants: room.users.map(u => u.name).join(', '),
      participantsCount: room.users.length,
      items: itemRows,
      subtotal: subtotal,
      totalItems: totalItems,
      itemCount: items.length
    };
  }

  /**
   * Open the receipt modal and populate it
   */
  function openReceiptModal(room) {
    const receipt = generateReceipt(room);
    if (!receipt) {
      CartShareUtils.showToast('Could not generate receipt', 'danger');
      return;
    }

    const container = document.getElementById('receiptContent');
    const printArea = document.getElementById('receiptPrintArea');
    if (!container) return;

    // Build the receipt HTML
    const html = buildReceiptHTML(receipt);
    container.innerHTML = html;
    if (printArea) printArea.innerHTML = html;

    // Show modal
    const modalEl = document.getElementById('receiptModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  /**
   * Build receipt HTML from receipt data
   */
  function buildReceiptHTML(receipt) {
    let itemsHtml = '';
    receipt.items.forEach(item => {
      itemsHtml += `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${item.quantity} × ${CartShareUtils.formatCurrency(item.price)}</td>
          <td class="text-end">${CartShareUtils.formatCurrency(item.total)}</td>
        </tr>
      `;
    });

    if (receipt.items.length === 0) {
      itemsHtml = `
        <tr>
          <td colspan="3" class="text-center" style="color:var(--cs-muted); padding:1rem;">
            No items in cart
          </td>
        </tr>
      `;
    }

    return `
      <div class="receipt-wrapper">
        <div class="receipt-header">
          <h3>🛒 CartShare</h3>
          <p style="font-size:0.9375rem; margin:0.25rem 0 0 0; color:var(--cs-text);">
            Receipt · Room <strong>${receipt.roomId}</strong>
          </p>
          <div class="receipt-meta">
            <span>${receipt.date}</span>
            <span>${receipt.time}</span>
          </div>
          <div class="receipt-meta" style="margin-top:0.25rem;">
            <span>${receipt.participantsCount} participant${receipt.participantsCount !== 1 ? 's' : ''}: ${receipt.participants}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Details</th>
              <th class="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <table style="margin-top:1rem;">
          <tr class="receipt-total">
            <td>Total (${receipt.totalItems} item${receipt.totalItems !== 1 ? 's' : ''})</td>
            <td></td>
            <td class="text-end">${CartShareUtils.formatCurrency(receipt.subtotal)}</td>
          </tr>
        </table>

        <div class="receipt-footer">
          <p style="margin:0;">Thank you for shopping together! 🎉</p>
          <p style="margin:0.25rem 0 0 0;">Split the total among ${receipt.participantsCount} participant${receipt.participantsCount !== 1 ? 's' : ''}</p>
        </div>
      </div>
    `;
  }

  /**
   * Trigger browser print
   */
  function printReceipt() {
    window.print();
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    generateReceipt,
    openReceiptModal,
    printReceipt
  };
})();
