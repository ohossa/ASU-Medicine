/** Public receiving details supplied by Omar. These are not provider secrets. */
export const SUPPORT = Object.freeze({
  recipient: "Omar HossamEldin Maged",
  ipa: "omarhossa_@instapay",
  phone: "01040479155",
  instapayUrl: "https://ipn.eg/S/omarhossa_/instapay/4S0M2b",
  whatsappNumber: "201040479155",
});
export function refundUrl(ar = false) {
  const message = ar
    ? "مرحباً عمر، أريد المساعدة في استرجاع تحويل بالخطأ لدعم ASUCodes. الطريقة: __ المبلغ: __ التاريخ: __ رقم العملية: __"
    : "Hi Omar, I need help with an ASUCodes support payment made by mistake. Method: __ Amount: __ Date: __ Transaction reference: __";
  return `https://wa.me/${SUPPORT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
