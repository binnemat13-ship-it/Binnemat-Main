import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { CheckCircle, MessageSquare, Truck, ShieldCheck, Building2, CreditCard, Copy, Check, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { APP_CONFIG } from '../../config/env';
import { submitLiveWcCheckout } from '../../services/wooCartService';

export default function CheckoutModal({ open, onClose }) {
  const { cartItems, subtotal, formattedSubtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    payment: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    notes: ''
  });
  const [copiedIban, setCopiedIban] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedIban(true);
    message.success('UBL IBAN copied to clipboard!');
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const getPaymentLabel = (type) => {
    switch (type) {
      case 'cod': return 'Cash on Delivery (COD)';
      case 'ibft': return `Direct Bank Transfer (${APP_CONFIG.BANK_NAME || 'UBL'})`;
      case 'card': return 'Debit / Credit Card (UBL IPG)';
      default: return 'Cash on Delivery (COD)';
    }
  };

  const generateWhatsAppUrl = (refId) => {
    let text = `*Salam Binnemat! New Order Placed*\n`;
    text += `*Order Ref:* ${refId}\n\n`;
    text += `*Items:*\n`;
    cartItems.forEach((item, idx) => {
      text += `${idx + 1}. ${item.name} (x${item.quantity}) - Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    text += `\n*Total Payable:* ${formattedSubtotal}\n`;
    text += `*Customer:* ${formData.name}\n`;
    text += `*Phone:* ${formData.phone}\n`;
    text += `*City:* ${formData.city || 'Pakistan'}\n`;
    text += `*Address:* ${formData.address}\n`;
    text += `*Payment Method:* ${getPaymentLabel(formData.payment)}\n`;
    if (formData.payment === 'ibft') {
      text += `\n*Bank Transfer Info:* Transferred to ${APP_CONFIG.BANK_NAME || 'UBL'} (${APP_CONFIG.BANK_IBAN}). Receipt attached below.\n`;
    } else if (formData.payment === 'card') {
      text += `\n*Card Details:* Card ending in ${formData.cardNumber.slice(-4) || '****'} (UBL Payment Processing)\n`;
    }
    if (formData.notes) text += `*Notes:* ${formData.notes}\n`;

    return `https://wa.me/${APP_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      message.error('Please enter name, phone, and complete delivery address.');
      return;
    }

    /*
    if (formData.payment === 'card') {
      const cleanNum = formData.cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15 || !formData.cardExpiry || !formData.cardCvc) {
        message.error('Please enter valid card number, expiry date (MM/YY), and CVV security code.');
        return;
      }
    }
    */

    setSubmitting(true);
    const orderRef = `BN-${Math.floor(100000 + Math.random() * 900000)}`;

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '') || 'customer';
    const wcPayload = {
      billing_address: {
        first_name: formData.name,
        last_name: '.',
        phone: formData.phone,
        email: cleanPhone + '@binnemat.com',
        city: formData.city || 'Pakistan',
        address_1: formData.address,
        postcode: '54000',
        state: 'PB',
        country: 'PK'
      },
      shipping_address: {
        first_name: formData.name,
        last_name: '.',
        phone: formData.phone,
        city: formData.city || 'Pakistan',
        address_1: formData.address,
        postcode: '54000',
        state: 'PB',
        country: 'PK'
      },
      customer_note: `${formData.notes ? formData.notes + ' | ' : ''}Payment: ${getPaymentLabel(formData.payment)} ${formData.payment === 'card' ? `(Card: **** ${formData.cardNumber.slice(-4)})` : ''}`,
      payment_method: formData.payment === 'cod' ? 'cod' : (formData.payment === 'ibft' ? 'bacs' : 'card')
    };
    const res = await submitLiveWcCheckout(wcPayload);

    const finalRef = res.success ? `WC-${res.orderId}` : orderRef;

    setCompletedOrder({
      refId: finalRef,
      paymentMethod: formData.payment,
      whatsAppUrl: generateWhatsAppUrl(finalRef)
    });
    setSubmitting(false);
    clearCart();
  };

  const handleFinish = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={640}
      style={{ maxWidth: '95vw', top: 20 }}
      className="checkout-modal"
    >
      {completedOrder ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#fff0f0] dark:bg-[#ff3131]/20 text-[#ff3131] dark:text-[#ff8585] border border-[#E5E4E2] dark:border-white/10 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle size={32} />
          </div>
          <h2 className="font-wix text-2xl font-extrabold text-slate-900 dark:text-white m-0 tracking-tight">
            Order Successfully Placed!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Your order reference is <strong className="text-[#ff3131] dark:text-[#ff8585] font-mono">{completedOrder.refId}</strong>. Our dispatch department has received your booking.
          </p>

          {/* IF BANK TRANSFER, SHOW INSTRUCTIONS TO SEND RECEIPT */}
          {completedOrder.paymentMethod === 'ibft' && (
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-left max-w-md mx-auto text-xs space-y-1.5">
              <span className="font-bold text-blue-900 dark:text-blue-300 block">
                Direct Bank Transfer (UBL IBFT)
              </span>
              <p className="text-slate-600 dark:text-slate-300 m-0">
                Please transfer <strong>{formattedSubtotal}</strong> to our official UBL account ({APP_CONFIG.BANK_IBAN}) and share the payment receipt screenshot on WhatsApp to confirm priority shipping.
              </p>
            </div>
          )}

          {/* IF CARD PAYMENT, SHOW CONFIRMATION */}
          {completedOrder.paymentMethod === 'card' && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-left max-w-md mx-auto text-xs space-y-1.5">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Card Payment Registered</span>
              </span>
              <p className="text-slate-600 dark:text-slate-300 m-0">
                Your payment of <strong>{formattedSubtotal}</strong> is registered under UBL merchant gateway. Click below to confirm order dispatch via WhatsApp.
              </p>
            </div>
          )}

          <div className="p-4 rounded-2xl glass-apple-card border border-[#E5E4E2] dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 max-w-sm mx-auto text-left space-y-1.5 shadow-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <strong className="text-slate-900 dark:text-white">{formData.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">City:</span>
              <strong className="text-slate-900 dark:text-white">{formData.city || 'Standard Logistics'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment:</span>
              <strong className="text-slate-900 dark:text-white">{getPaymentLabel(completedOrder.paymentMethod)}</strong>
            </div>
            <div className="flex justify-between border-t border-[#E5E4E2] dark:border-white/10 pt-1.5 mt-1">
              <span className="text-slate-500">Total:</span>
              <strong className="text-[#ff3131] dark:text-[#ff8585] font-mono font-bold">{formattedSubtotal}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={completedOrder.whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#ff3131] to-[#d01a1a] hover:brightness-105 text-white font-bold text-xs shadow-md no-underline"
            >
              <MessageSquare size={16} />
              <span>{completedOrder.paymentMethod === 'ibft' ? 'Send Receipt on WhatsApp' : 'Confirm Order on WhatsApp'}</span>
            </a>
            <Button
              onClick={handleFinish}
              className="rounded-full h-11 px-6 font-semibold border-[#E5E4E2] dark:border-white/10 text-slate-700 dark:text-slate-200"
            >
              Done &amp; Return to Store
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-2">
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#ff3131] dark:text-[#ff8585] block mb-1">
            EXPRESS CHECKOUT &bull; OFFICIAL STORE
          </span>
          <h2 className="font-wix text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Delivery &amp; Payment Options
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
              <Input
                placeholder="e.g. Tariq Mahmood"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-xl h-10 border-[#E5E4E2] dark:border-white/10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">WhatsApp / Phone *</label>
                <Input
                  placeholder="0321 0000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="rounded-xl h-10 border-[#E5E4E2] dark:border-white/10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City *</label>
                <Input
                  placeholder="Lahore / Gujranwala / Karachi"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="rounded-xl h-10 border-[#E5E4E2] dark:border-white/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Complete Delivery Address *</label>
              <Input.TextArea
                rows={2}
                placeholder="House #, Street, Phase / Block, Area"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="rounded-xl border-[#E5E4E2] dark:border-white/10"
              />
            </div>

            {/* CUSTOM LUXURY PAYMENT SELECTOR TABS (NO BROKEN RADIO OVERLAYS) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Select Payment Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                {/* 1. CASH ON DELIVERY */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, payment: 'cod' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    formData.payment === 'cod'
                      ? 'border-[#ff3131] bg-[#fff0f0] dark:bg-[#ff3131]/15 text-[#ff3131] dark:text-[#ff8585] shadow-xs'
                      : 'border-[#E5E4E2] dark:border-white/10 bg-white dark:bg-[#1A1715] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <Truck size={18} className={formData.payment === 'cod' ? 'text-[#ff3131]' : 'text-slate-500'} />
                  <span className="text-xs font-bold">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-400 font-medium">Pay at doorstep</span>
                </button>

                {/* 2. BANK TRANSFER */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, payment: 'ibft' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    formData.payment === 'ibft'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'border-[#E5E4E2] dark:border-white/10 bg-white dark:bg-[#1A1715] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <Building2 size={18} className={formData.payment === 'ibft' ? 'text-blue-600' : 'text-slate-500'} />
                  <span className="text-xs font-bold">Bank Transfer (UBL)</span>
                  <span className="text-[10px] text-slate-400 font-medium">Direct IBAN / Raast</span>
                </button>

                {/* 3. CARD PAYMENT (COMMENTED OUT)
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, payment: 'card' })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    formData.payment === 'card'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 shadow-xs'
                      : 'border-[#E5E4E2] dark:border-white/10 bg-white dark:bg-[#1A1715] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <CreditCard size={18} className={formData.payment === 'card' ? 'text-emerald-600' : 'text-slate-500'} />
                  <span className="text-xs font-bold">Debit / Credit Card</span>
                  <span className="text-[10px] text-slate-400 font-medium">Visa &amp; Mastercard</span>
                </button>
                */}
              </div>
            </div>

            {/* EXPANDABLE BANK TRANSFER (UBL IBAN) DETAILS BOX */}
            {formData.payment === 'ibft' && (
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/25 border border-blue-200 dark:border-blue-900/50 space-y-2.5 transition-all text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-900/50">
                  <span className="font-extrabold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <Building2 size={15} className="text-blue-600" />
                    <span>{APP_CONFIG.BANK_NAME || 'United Bank Limited (UBL)'}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-bold">
                    Official Settlement Account
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Account Title:</span>
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {APP_CONFIG.BANK_ACCOUNT_TITLE || 'BIN NEMAT APPLIANCES'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Account Number:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">
                      {APP_CONFIG.BANK_ACCOUNT_NUMBER || '12345678901234'}
                    </strong>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block mb-1">Official IBAN Number:</span>
                  <div className="flex items-center justify-between bg-white dark:bg-[#12100E] p-2 rounded-xl border border-blue-200 dark:border-blue-900/60">
                    <span className="font-mono font-bold text-xs text-blue-950 dark:text-blue-200 tracking-wider">
                      {APP_CONFIG.BANK_IBAN || 'PK00UNIL0109000123456789'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(APP_CONFIG.BANK_IBAN || 'PK00UNIL0109000123456789')}
                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-none cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center gap-1 text-[11px] font-bold"
                    >
                      {copiedIban ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copiedIban ? 'Copied' : 'Copy IBAN'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic m-0 pt-1">
                  💡 Note: Transfer through any bank app (1Link / Raast) and send the screenshot on WhatsApp after booking.
                </p>

                {/* SEND SCREENSHOT VIA WHATSAPP BUTTON */}
                <div className="pt-2 border-t border-blue-200 dark:border-blue-900/50">
                  <a
                    href={`https://wa.me/${APP_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(`Salam Binnemat! I have made the bank transfer of ${formattedSubtotal}${formData.name ? ` for order by ${formData.name}` : ''}. Attaching the payment receipt screenshot below.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all no-underline cursor-pointer active:scale-[0.98]"
                  >
                    <MessageSquare size={15} />
                    <span>Send Screenshot</span>
                  </a>
                </div>
              </div>
            )}

            {/* EXPANDABLE INTERACTIVE CARD INPUT FIELDS (COMMENTED OUT)
            {formData.payment === 'card' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-slate-50/60 dark:from-emerald-950/30 dark:via-[#161311] dark:to-white/[0.02] border border-emerald-300/80 dark:border-emerald-800/60 space-y-3.5 transition-all">
                <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200/60 dark:border-emerald-900/40">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <strong className="text-xs text-emerald-950 dark:text-emerald-200 block leading-tight">
                        UBL Pay / Visa &amp; Mastercard
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        256-Bit SSL Encrypted 3D-Secure Transaction
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    <Lock size={11} />
                    <span>3D Secure</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Card Number *
                  </label>
                  <Input
                    placeholder="4123 4567 8901 2345"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                    maxLength={19}
                    prefix={<CreditCard size={15} className="text-slate-400 mr-1" />}
                    required={formData.payment === 'card'}
                    className="rounded-xl h-10 border-[#E5E4E2] dark:border-white/10 font-mono tracking-wider text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cardholder Name *
                  </label>
                  <Input
                    placeholder="Name as printed on card"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    required={formData.payment === 'card'}
                    className="rounded-xl h-10 border-[#E5E4E2] dark:border-white/10 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Expiry Date (MM/YY) *
                    </label>
                    <Input
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: formatExpiry(e.target.value) })}
                      maxLength={5}
                      required={formData.payment === 'card'}
                      className="rounded-xl h-10 border-[#E5E4E2] dark:border-white/10 font-mono text-center text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      CVV / Security Code *
                    </label>
                    <Input.Password
                      placeholder="3 or 4 digits"
                      value={formData.cardCvc}
                      onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      maxLength={4}
                      required={formData.payment === 'card'}
                      className="rounded-xl h-10 border-[#E5E4E2] dark:border-white/10 font-mono text-center text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <ShieldCheck size={13} className="text-emerald-600 flex-shrink-0" />
                  <span>Card payments are routed through UBL gateway with OTP verification.</span>
                </div>
              </div>
            )}
            */}

            <div className="p-3.5 rounded-2xl bg-[#fff0f0]/60 dark:bg-white/[0.04] border border-[#E5E4E2] dark:border-white/10 flex justify-between items-center text-xs shadow-sm">
              <div>
                <span className="text-slate-500 block">Total Payable:</span>
                <strong className="text-base text-[#ff3131] dark:text-[#ff8585] font-mono font-extrabold">
                  {formattedSubtotal}
                </strong>
              </div>
              <div className="text-right text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ Free Doorstep Delivery
              </div>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="w-full rounded-full h-12 font-bold bg-gradient-to-r from-[#ff3131] to-[#d01a1a] hover:brightness-105 border-none text-white shadow-md text-sm mt-2 cursor-pointer"
            >
              Confirm &amp; Book Order
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
}
