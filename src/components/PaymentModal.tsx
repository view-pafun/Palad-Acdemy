import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Printer, 
  Download, 
  Receipt,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, PaymentSlip } from '../types';

interface PaymentModalProps {
  course: Course;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ course, onClose }) => {
  const [method, setMethod] = useState<'promptpay' | 'credit_card' | 'slip_upload'>('promptpay');
  const [countdown, setCountdown] = useState(300); // 5 mins
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<PaymentSlip | null>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4214 •••• •••• 8912');
  const [cardHolder, setCardHolder] = useState('MR. STUDENT UDRU');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Slip form
  const [slipFile, setSlipFile] = useState<string | null>(null);
  const [payerName, setPayerName] = useState('นายวิศวกร สังคม');
  const [payerPhone, setPayerPhone] = useState('081-234-5678');

  const coursePrice = course.price || 390;

  useEffect(() => {
    if (method === 'promptpay' && countdown > 0 && !isSuccess) {
      const timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
      return () => clearInterval(timer);
    }
  }, [method, countdown, isSuccess]);

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const slip: PaymentSlip = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      courseTitle: course.title,
      amount: coursePrice,
      paymentMethod: method,
      payerName: payerName,
      payerPhone: payerPhone,
      paidAt: '30 กันยายน 2026, 19:45 น.',
      receiptNumber: `REC-UDRU-${Math.floor(10000 + Math.random() * 90000)}`
    };

    setReceiptData(slip);
    setIsSuccess(true);
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Top title */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base">
              ระบบรับชำระเงิน (Secure Payment Gateway)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Course Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">หลักสูตร</span>
                <p className="font-bold text-slate-900 text-sm line-clamp-1">{course.title}</p>
                <p className="text-xs text-slate-500">พร้อมรับใบประกาศนียบัตรเมื่อเรียนจบ</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase">ยอดชำระ</span>
                <p className="text-xl font-extrabold text-emerald-600 font-mono">฿{coursePrice}</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('promptpay')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  method === 'promptpay'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">PromptPay QR</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('credit_card')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  method === 'credit_card'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-xs">บัตรเครดิต/เดบิต</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('slip_upload')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  method === 'slip_upload'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Upload className="w-5 h-5 text-amber-600" />
                <span className="text-xs">แนบสลิปโอนเงิน</span>
              </button>
            </div>

            {/* Form per method */}
            {method === 'promptpay' && (
              <div className="text-center space-y-3">
                <div className="bg-slate-900 text-white py-1.5 px-4 rounded-xl inline-flex items-center gap-1.5 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>หมดเวลาใน {formatCountdown(countdown)}</span>
                </div>

                <div className="w-48 h-48 bg-white border-2 border-slate-300 rounded-2xl mx-auto p-2 flex flex-col items-center justify-center shadow-inner">
                  {/* PromptPay stylized SVG QR */}
                  <div className="w-full h-full bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center text-white">
                    <span className="text-[10px] font-bold text-blue-400 mb-1">PROMPTPAY</span>
                    <div className="grid grid-cols-5 gap-1.5 w-24 h-24">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`rounded-xs ${i % 2 === 0 ? 'bg-white' : 'bg-transparent'}`} />
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-2 font-mono">UDRU-042211040</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  สแกนผ่านแอปธนาคารใดก็ได้ เพื่อชำระยอด <span className="font-bold text-slate-900">฿{coursePrice}</span>
                </p>

                <button
                  onClick={handleCompletePayment}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md transition"
                >
                  ชำระเงินเรียบร้อยแล้ว (ตรวจสอบอัตโนมัติ)
                </button>
              </div>
            )}

            {method === 'credit_card' && (
              <form onSubmit={handleCompletePayment} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    หมายเลขบัตร (Card Number)
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      วันหมดอายุ (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="text"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อผู้ถือบัตร
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md transition"
                >
                  ยืนยันชำระเงิน ฿{coursePrice}
                </button>
              </form>
            )}

            {method === 'slip_upload' && (
              <form onSubmit={handleCompletePayment} className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <p className="font-bold">โอนเข้าบัญชี: กองทุนพัฒนาการเรียนรู้ตลอดชีวิต (UDRU)</p>
                  <p>ธนาคารกรุงไทย เลขที่บัญชี: 401-0-12345-6</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อผู้โอน
                  </label>
                  <input
                    type="text"
                    required
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    แนบไฟล์ภาพสลิปการโอนเงิน
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-600">คลิกเพื่อเลือกรูปภาพหลักฐานการโอน</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md transition"
                >
                  แจ้งการชำระเงิน
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Official Payment Receipt / Tax Invoice */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">ชำระเงินสำเร็จแล้ว! 🎉</h3>
              <p className="text-xs text-slate-500">
                คุณสามารถเข้าเรียนและทำแบบทดสอบเพื่อรับเกียรติบัตรได้ทันที
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-[#faf9f5] border border-slate-200 rounded-2xl p-6 text-left space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">ใบเสร็จรับเงิน (OFFICIAL RECEIPT)</p>
                  <p className="text-[10px] text-slate-500">โครงการพัฒนาทักษะการเรียนรู้ตลอดชีวิต</p>
                </div>
                <span className="text-emerald-700 font-bold">{receiptData?.receiptNumber}</span>
              </div>

              <div className="space-y-1 text-slate-700">
                <p>รายการ: <span className="font-semibold text-slate-900">{receiptData?.courseTitle}</span></p>
                <p>ผู้ชำระ: {receiptData?.payerName}</p>
                <p>เวลาที่ชำระ: {receiptData?.paidAt}</p>
                <p>ช่องทาง: {receiptData?.paymentMethod}</p>
                <p className="text-sm font-bold text-emerald-700 pt-2 border-t border-slate-200">
                  ยอดรวมทั้งสิ้น: ฿{receiptData?.amount.toLocaleString()} บาท (สุทธิ)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์ใบเสร็จ</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                เข้าสู่คอร์สเรียน
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
